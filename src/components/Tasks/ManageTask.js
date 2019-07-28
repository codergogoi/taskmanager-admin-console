import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

//Common Icons
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import AvailableTaskIcon from '@material-ui/icons/Storage';
import AssignedTaskIcon from '@material-ui/icons/AssignmentTurnedIn';

// App Classes
import Table from './TaskTable';
import axios from 'axios';
import CardDiv from '../common/CardDiv';
import AddTask from './AddTask';
import EditTask from './EditTask';
import { baseURL } from '../AppConst';
import Alert from '../common/Alert';

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
	button: {
		margin: theme.spacing.unit
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

class ManageTask extends Component {
	constructor(props) {
		super(props);
		this.state = {
			assignedTaskList: [],
			availableTaskList: [],
			value: 0,
			isAddNew: false,
			isEdit: false,
			task_id: '',
			data_approved: [],
			data_verify: []
		};
	}

	handleChange = (event, value) => {
		if (value > 0) {
			this.fetchAssignedTask();
		} else {
			this.fetchAvailableTask();
		}

		this.setState({ value });
	};

	componentWillMount() {
		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		this.fetchAvailableTask();
	}

	fetchAvailableTask = () => {
		axios
			.post('', {
				action: 'available-task-adm',
				user_id: ''
			})
			.then((res) => {
				const data = res.data.data;
				const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
					this.setState({ availableTaskList: responseString.data });
				} else {
					console.log('Data Not found');
				}
			});
	};

	fetchAssignedTask = () => {
		axios
			.post('', {
				action: 'assigned-task',
				user_id: ''
			})
			.then((res) => {
				const data = res.data.data;
				const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
					this.setState({ assignedTaskList: responseString.data });
				} else {
					console.log('Data Not found');
				}
			});
	};

	onTapAddNewTask() {
		this.setState({ isAddNew: true });
	}

	onTapBack() {
		this.setState({ isAddNew: false, isEdit: false });

		if (this.state.value == 0) {
			this.fetchAvailableTask();
		} else {
			this.fetchAssignedTask();
		}
	}

	onEditTask(task) {
		this.setState({ isAddNew: false, isEdit: true, curent_task: task });
	}

	onTapExport() {
		this.setState({ isExport: true });
	}

	

	onDeleteTask(task_id) {
		this.setState({
			task_id: task_id,
			showAlert: true,
			msg: 'Are you sure to delete the selected Task?',
			title: 'Delete Confirmation!'
		});
	}

	onExecuteDeleteCommand() {
		const { task_id } = this.state;

		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		axios
			.post('', {
				action: 'remove-task',
				task_id: task_id
			})
			.then((res) => {
				const data = res.data.data;
				const status = parseInt(res.data.status);
				if (status === 200) {
					this.fetchAssignedTask();
				}
			});
	}

	render() {
		const { classes } = this.props;
		const { value, isAddNew, isEdit, showAlert, title, msg } = this.state;

		if (isAddNew) {
			return (
				<CardDiv title={'Add New Task'}>
					<AddTask onTapBack={this.onTapBack.bind(this)} />
				</CardDiv>
			);
		} else if (isEdit) {
			return (
				<CardDiv title={'Assign Task'}>
					<EditTask onTapBack={this.onTapBack.bind(this)} current_task={this.state.curent_task} />
				</CardDiv>
			);
		} else {
			return (
				<div>
					<Alert
						open={showAlert}
						onCancel={this.onOkay.bind(this)}
						onOkay={this.onOkay.bind(this)}
						title={title}
						msg={msg}
					/>

					<CardDiv title={'Manage Task'}>
						<Tabs
							value={value}
							onChange={this.handleChange}
							scrollable
							scrollButtons="on"
							indicatorColor="secondary"
							textColor="secondary"
						>
							<Tab label="Available Task" icon={<AvailableTaskIcon />} />
							<Tab label="Assigned Task" icon={<AssignedTaskIcon />} />
						</Tabs>

						{value === 0 && (
							<TabContainer>
								<Button
									variant="extendedFab"
									color="secondary"
									className={classes.btnRightA}
									onClick={this.onTapAddNewTask.bind(this)}
								>
									Add Task <AddIcon className={classes.rightIcon} />
								</Button>
								<Table
									onEdit={this.onEditTask.bind(this)}
									isEdit={true}
									data={this.state.availableTaskList}
								/>
							</TabContainer>
						)}
						{value === 1 && (
							<TabContainer>
								

								<Table
									onEdit={this.onEditTask.bind(this)}
									onDeleteTask={this.onDeleteTask.bind(this)}
									isEdit={false}
									data={this.state.assignedTaskList}
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

ManageTask.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ManageTask);
