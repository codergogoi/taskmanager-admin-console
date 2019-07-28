import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Icons
import EmployeeIcon from '@material-ui/icons/SupervisorAccount';
import AddEmployeeIcon from '@material-ui/icons/PersonAdd';
import Table from './EmployeeTable';
import axios from 'axios';
import Alert from '../common/Alert';

//App Classes
import CardDiv from '../common/CardDiv';
import AddEmployee from './AddEmployee';
import { baseURL } from '../AppConst';

function TabContainer(props) {
	return (
		<Typography component="div" style={{ padding: 8 * 3 }}>
			{props.children}
		</Typography>
	);
}

TabContainer.propTypes = {
	children: PropTypes.node.isRequired
};

const styles = (theme) => ({
	root: {
		flexGrow: 1,
		width: '100%'
	},
	bar: {
		backgroundColor: '#1a237e'
	},
	rightIcon: {
		marginLeft: theme.spacing.unit
	},
	btnRightA: {
		position: 'absolute',
		top: theme.spacing.unit * 20,
		right: theme.spacing.unit * 10
	}
});

class ManageEmployee extends Component {
	constructor(props) {
		super(props);
		this.state = {
			employeeList: [],
			value: 0,
			delete_emp_id: '',
			isAddNew: false,
			isEdit: false,
			current_employee: '',
			data_approved: [],
			data_verify: []
		};
	}

	handleChange = (event, value) => {
		this.setState({ value });
	};

	componentWillMount() {
		this.fetchEmployeeList();
	}

	fetchEmployeeList() {
		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		axios
			.post('', {
				action: 'view-users',
				user_id: ''
			})
			.then((res) => {
				const data = res.data.data;
				const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
					this.setState({ employeeList: responseString.data });
				} else {
					console.log('Data Not found');
				}
			});
	}

	onTapRegister() {
		this.setState({ isAddNew: true });
	}

	onTapBack() {
		this.setState({ isAddNew: false, isEdit: false });
		this.fetchEmployeeList();
	}

	onEditUser(employee) {
		this.setState({ isEdit: true, current_employee: employee });
	}

	onDeleteUser(employee) {
		const { id } = employee;
		this.setState({
			delete_emp_id: id,
			showAlert: true,
			msg: 'Are you sure to delete the selected User?',
			title: 'Delete Confirmation!'
		});
	}

	onExecuteDeleteCommand() {
		const { delete_emp_id } = this.state;

		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		axios
			.post('', {
				action: 'remove-users',
				emp_id: delete_emp_id
			})
			.then((res) => {
				const data = res.data.data;
				const status = parseInt(res.data.status);
				if (status === 200) {
					this.fetchEmployeeList();
				}
			});
	}

	render() {
		const { classes } = this.props;
		const { value, isAddNew, isEdit, current_employee, showAlert, title, msg } = this.state;

		if (isAddNew) {
			return (
				<CardDiv title={'Add New Employee'}>
					<AddEmployee onTapBack={this.onTapBack.bind(this)} />
				</CardDiv>
			);
		} else if (isEdit) {
			return (
				<CardDiv title={'Edit Employee'}>
					<AddEmployee
						onTapBack={this.onTapBack.bind(this)}
						current_employee={current_employee}
						isEdit={isEdit}
					/>
				</CardDiv>
			);
		} else {
			return (
				<div>
					<Alert
						open={showAlert}
						onCancel={this.onDismiss.bind(this)}
						onOkay={this.onOkay.bind(this)}
						title={title}
						msg={msg}
					/>

					<CardDiv title={'Manage Employee'}>
						<Tabs
							value={value}
							onChange={this.handleChange}
							scrollable
							scrollButtons="on"
							indicatorColor="secondary"
							textColor="secondary"
						>
							<Tab label="Employees" icon={<EmployeeIcon />} />
						</Tabs>

						{value === 0 && (
							<TabContainer>
								<Button
									variant="extendedFab"
									color="secondary"
									className={classes.btnRightA}
									onClick={this.onTapRegister.bind(this)}
								>
									Register <AddEmployeeIcon className={classes.rightIcon} />
								</Button>
								<Table
									onEditUser={this.onEditUser.bind(this)}
									onDeleteUser={this.onDeleteUser.bind(this)}
									isEdit={true}
									data={this.state.employeeList}
								/>
							</TabContainer>
						)}
					</CardDiv>
				</div>
			);
		}
	}

	//ALERT
	onDismiss = () => {
		this.setState({ showAlert: false });
	};

	onOkay = () => {
		this.setState({ showAlert: false });
		this.onExecuteDeleteCommand();
	};
}

ManageEmployee.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ManageEmployee);
