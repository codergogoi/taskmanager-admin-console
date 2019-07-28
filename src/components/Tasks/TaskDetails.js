import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';


//Icons
import PendingTaskIcon from '@material-ui/icons/AssignmentReturned';
import ComletedTaskIcon from '@material-ui/icons/AssignmentTurnedIn';
import Button from '@material-ui/core/Button';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import SaveIcon from '@material-ui/icons/Save';
import DoneIcon from '@material-ui/icons/DoneAll';

// App Classes
import axios from 'axios';
import CardDiv from '../common/CardDiv';
import Alert from '../common/Alert';
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
	heading: {
		fontSize: 16,
		fontWeight: 'bold',
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit
	},
	bar: {
		backgroundColor: '#1a237e'
	},
	rightIcon: {
		marginLeft: theme.spacing.unit
	},
	optionsText: {
		fontSize: 16,
		fontWeight: 'bold',
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		marginTop: 10
	},
	remarksTextField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: 650
	},
	detailsText: {
		fontSize: 16,
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		marginTop: 10
	},
	btnRightA: {
		position: 'absolute',
		top: theme.spacing.unit * 15,
		right: theme.spacing.unit * 10
	},
	button: {
		marginTop: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		marginTop: 20
	}
});

class TaskDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: 0,
			user_type: this.props.user_type,
			isExport: false,
			start_date: '0000/00/00',
			end_date: '0000/00/00',
			isAddNew: false,
			isEdit: false,
			emp_id: this.props.emp_id,
			pendingTaskList: [],
			completedTaskList: [],
			data_approved: [],
			data_verify: [],
			expanded: null,
			remarks: '',
			task_id: '',
			status: ''
		};
	}

	handleChange = (event, value) => {
		if (value > 0) {
			this.fetchCompletedTask();
		} else {
			this.fetchPendingTask();
		}

		this.setState({ value });
	};

	componentWillMount() {
		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		this.fetchPendingTask();
	}

	//Fetch Task Details

	fetchPendingTask = () => {
		const { emp_id } = this.state;

		axios
			.post('', {
				action: 'pending-task',
				user_id: emp_id
			})
			.then((res) => {
				const data = res.data.data;
				const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
					this.setState({ pendingTaskList: responseString.data });
				} else {
					console.log('Data Not found');
				}
			});
	};

	fetchCompletedTask = () => {
		const { emp_id } = this.state;
		axios
			.post('', {
				action: 'completed-task',
				user_id: emp_id
			})
			.then((res) => {
				const data = res.data.data;
				const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
					this.setState({ completedTaskList: responseString.data });
				}
			});
	};

	onTapExport() {
		this.setState({ isExport: true });
	}

	onTapDownload() {

		const { start_date, end_date,user_type ,emp_id } = this.state;

		if (start_date == '0000/00/00') {
			this.setState({
				showAlert: true,
				msg: 'Please Select From Date',
				title: 'From Date is Empty!'
			});
			return;
		}

		if (end_date == '0000/00/00') {
			this.setState({
				showAlert: true,
				msg: 'Please Select To Date',
				title: 'To Date is Empty!'
			});
			return;
		}

		this.setState({ isExport: false });

		const emp_url =
			baseURL + 'export_report.php?mode=1&emp_id=' + emp_id + '&s_date=' + start_date + '&e_date=' + end_date;

		const admin_url =
			baseURL + 'export_report.php?mode=1&emp_id=ALL' + '&s_date=' + start_date + '&e_date=' + end_date;

		if (user_type === 'Admin') {
			window.open(admin_url, '_self');
		} else {
			window.open(emp_url, '_self'); //to open new page
		}
	}

	addNewUser() {
		this.setState({ isAddNew: true });
	}

	onTapBack() {
		this.setState({ isAddNew: false, isEdit: false });
	}

	onEditPartner(partnerId) {
		this.setState({ isEdit: true, owner_id: partnerId });
	}

	//Expand View
	handleCollapse = (panel, n) => (event, expanded) => {
		this.setState({
			remarks: n.remarks,
			task_id: n.id,
			expanded: expanded ? panel : false
		});
	};

	handleRemarksChanges = (e) => {
		this.setState({
			remarks: e.target.value
		});
	};

	handleTextChanges = (event) => {
		if (event.target.id == 'start-date') {
			this.setState({ start_date: event.target.value });
		} else if (event.target.id == 'end-date') {
			this.setState({ end_date: event.target.value });
		}
	};

	//ON Tap Actions
	onTapMoveToCompleted = () => {
		const { task_id } = this.state;

		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		axios
			.post('', {
				action: 'update-task',
				task_id: task_id,
				status: 'completed'
			})
			.then((res) => {
				const responseString = JSON.parse(JSON.stringify(res.data));
				console.log('response' + responseString);

				if (responseString.status === 200) {
					this.setState({
						showAlert: true,
						isDone: true,
						msg: 'Task Updated Successfully',
						title: 'Update Task Status'
					});
				} else {
					this.setState({
						showAlert: true,
						msg: 'Error on Update Task!',
						title: 'Update Task Status'
					});
				}
			});
	};

	onTapReOpenTask = () => {
		const { task_id } = this.state;

		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		axios
			.post('', {
				action: 'update-task',
				task_id: task_id,
				status: 'pending'
			})
			.then((res) => {
				const responseString = JSON.parse(JSON.stringify(res.data));
				console.log('response' + responseString);

				if (responseString.status === 200) {
					this.setState({
						showAlert: true,
						isDone: true,
						msg: 'Task Updated Successfully',
						title: 'Update Task Status'
					});
				} else {
					this.setState({
						showAlert: true,
						msg: 'Error on Update Task!',
						title: 'Update Task Status'
					});
				}
			});
	};

	onTapSaveChanges = () => {
		const { task_id, remarks } = this.state;

		if (remarks.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please enter remarks content to save.',
				title: 'Remarks is required!'
			});
			return;
		}

		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		axios
			.post('', {
				action: 'update-task-remarks',
				task_id: task_id,
				remarks: remarks
			})
			.then((res) => {
				const responseString = JSON.parse(JSON.stringify(res.data));
				console.log('response' + responseString);

				if (responseString.status === 200) {
					this.setState({
						showAlert: true,
						msg: 'Remarks Saved Successfully',
						title: 'Update Remarks'
					});
				} else {
					this.setState({
						showAlert: true,
						msg: 'Error on Update Remarks',
						title: 'Update Remarks'
					});
				}
			});
	};

	pendingPanel() {
		const { classes } = this.props;
		const { expanded, pendingTaskList, remarks } = this.state;

		return (
			<div>
				{pendingTaskList.map((n) => {
					return (
						<ExpansionPanel expanded={expanded === n.id} onChange={this.handleCollapse(n.id, n)}>
							<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
								<Typography className={classes.heading}>{n.title}</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<Grid container spacing={24}>
									<Grid item xs={9}>
										<FormControl>
											<Typography paragraph>{n.details}</Typography>

											<TextField
												id="remarks"
												label="Remarks"
												multiline
												rowsMax="10"
												value={remarks}
												onChange={this.handleRemarksChanges.bind(this)}
												className={classes.remarksTextField}
												margin="normal"
												variant="outlined"
											/>

											<div>
												<Button
													variant="extendedFab"
													color="secondary"
													className={classes.button}
													onClick={this.onTapSaveChanges.bind(this)}
												>
													<SaveIcon />
												</Button>

												<Button
													variant="extendedFab"
													color="secondary"
													className={classes.button}
													onClick={this.onTapMoveToCompleted.bind(this)}
												>
													Completed <DoneIcon className={classes.rightIcon} />
												</Button>
											</div>
										</FormControl>
									</Grid>
									<Grid item xs={3}>
										<FormControl>
											<TextField
												id="deadline"
												label="Task Deadline"
												className={classes.textField}
												value={moment(n.deadline).format('Do MMM YYYY')}
												margin="normal"
												variant="outlined"
												disabled="true"
											/>

											<TextField
												id="task_type"
												label="Task Type"
												className={classes.textField}
												value={n.type}
												margin="normal"
												variant="outlined"
												disabled="true"
											/>

											<TextField
												id="priority"
												label="Priority"
												className={classes.textField}
												value={n.priority}
												margin="normal"
												variant="outlined"
												disabled="true"
											/>

											<TextField
												id="task_point"
												label="Task Points"
												className={classes.textField}
												value={n.points}
												margin="normal"
												variant="outlined"
												disabled="true"
											/>
										</FormControl>
									</Grid>
								</Grid>
							</ExpansionPanelDetails>
						</ExpansionPanel>
					);
				})}
			</div>
		);
	}

	completedPanel() {
		const { classes } = this.props;
		const { expanded, completedTaskList, remarks } = this.state;

		return (
			<div>
				{completedTaskList.map((n) => {
					return (
						<ExpansionPanel expanded={expanded === n.id} onChange={this.handleCollapse(n.id, n)}>
							<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
								<Typography className={classes.heading}>{n.title}</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<Grid container spacing={24}>
									<Grid item xs={9}>
										<FormControl>
											<Typography paragraph>{n.details}</Typography>

											<TextField
												id="remarks"
												label="Remarks"
												multiline
												rowsMax="10"
												value={remarks}
												onChange={this.handleRemarksChanges.bind(this)}
												className={classes.remarksTextField}
												margin="normal"
												variant="outlined"
											/>

											<div>
												<Button
													variant="extendedFab"
													color="secondary"
													className={classes.button}
													onClick={this.onTapSaveChanges.bind(this)}
												>
													<SaveIcon />
												</Button>

												<Button
													variant="extendedFab"
													color="secondary"
													className={classes.button}
													onClick={this.onTapReOpenTask.bind(this)}
												>
													Re-Open <DoneIcon className={classes.rightIcon} />
												</Button>
											</div>
										</FormControl>
									</Grid>
									<Grid item xs={3}>
										<FormControl>
											<TextField
												id="deadline"
												label="Task Deadline"
												className={classes.textField}
												value={moment(n.deadline).format('Do MMM YYYY')}
												margin="normal"
												variant="outlined"
												disabled="true"
											/>

											<TextField
												id="task_type"
												label="Task Type"
												className={classes.textField}
												value={n.type}
												margin="normal"
												variant="outlined"
												disabled="true"
											/>

											<TextField
												id="priority"
												label="Priority"
												className={classes.textField}
												value={n.priority}
												margin="normal"
												variant="outlined"
												disabled="true"
											/>

											<TextField
												id="task_point"
												label="Task Points"
												className={classes.textField}
												value={n.points}
												margin="normal"
												variant="outlined"
												disabled="true"
											/>
										</FormControl>
									</Grid>
								</Grid>
							</ExpansionPanelDetails>
						</ExpansionPanel>
					);
				})}
			</div>
		);
	}

	render() {
		const { classes } = this.props;

		const { showAlert, title, msg, value, isExport, start_date, end_date } = this.state;

		return (
			<CardDiv title={'Task Details'}>
				{isExport == false ? (
					<Button
						variant="extendedFab"
						color="secondary"
						className={classes.btnRightA}
						onClick={this.onTapExport.bind(this)}
					>
						Export Task
					</Button>
				) : (
					''
				)}
				{isExport == true ? (
					<div className={classes.btnRightA}>
						<TextField
							id="start-date"
							label="Date From"
							className={classes.selectionField}
							type="date"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={start_date}
						/>
						<TextField
							id="end-date"
							label="Date To"
							className={classes.selectionField}
							type="date"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={end_date}
						/>
						<Button variant="extendedFab" color="secondary" onClick={this.onTapDownload.bind(this)}>
							<DownloadIcon />
						</Button>
					</div>
				) : (
					''
				)}

				<Tabs
					value={value}
					onChange={this.handleChange}
					scrollable
					scrollButtons="on"
					indicatorColor="secondary"
					textColor="secondary"
				>
					<Tab label="Pending Task" icon={<PendingTaskIcon />} />
					<Tab label="Completed Task" icon={<ComletedTaskIcon />} />
				</Tabs>

				<Alert
					open={showAlert}
					onCancel={this.onOkay.bind(this)}
					onOkay={this.onOkay.bind(this)}
					title={title}
					msg={msg}
				/>

				{value === 0 && <TabContainer>{this.pendingPanel()}</TabContainer>}
				{value === 1 && <TabContainer>{this.completedPanel()}</TabContainer>}
			</CardDiv>
		);
	}

	//ALERT
	onDismiss = () => {
		this.setState({ showAlert: false });
	};

	onOkay = () => {
		const { isDone, value } = this.state;

		this.setState({ showAlert: false });

		if (isDone) {
			if (value > 0) {
				this.fetchCompletedTask();
			} else {
				this.fetchPendingTask();
			}
		}
	};
}

TaskDetails.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TaskDetails);
