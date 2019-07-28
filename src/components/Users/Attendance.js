import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AttendanceListIcon from '@material-ui/icons/ViewList';
import ApprovedIcon from '@material-ui/icons/Spellcheck';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Chip from '@material-ui/core/Chip';

//Icons
import AttendanceIcon from '@material-ui/icons/Fingerprint';
import LeaveIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/DoneAll';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DownloadIcon from '@material-ui/icons/CloudDownload';

// App Classes
import axios from 'axios';
import { baseURL } from '../AppConst';
import CardDiv from '../common/CardDiv';
import AttendanceTable from './AttendanceTable';
import ApplyLeaves from './ApplyLeaves';
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
	leftIcon: {
		marginRight: theme.spacing.unit
	},
	rightIcon: {
		marginLeft: theme.spacing.unit
	},
	button: {
		marginRight: theme.spacing.unit,
		marginLeft: theme.spacing.unit,
		marginTop: theme.spacing.unit * 2
	},
	btnRightA: {
		position: 'absolute',
		top: theme.spacing.unit * 20,
		right: theme.spacing.unit * 10
	},
	btnRightB: {
		position: 'absolute',
		top: theme.spacing.unit * 20,
		right: theme.spacing.unit * 20
	},
	chipRed: {
		margin: theme.spacing.unit,
		backgroundColor: '#CC0000',
		color: '#FFFFFF'
	},
	chipYellow: {
		margin: theme.spacing.unit,
		backgroundColor: '#FF8C00',
		color: '#FFFFFF'
	},
	chipGreen: {
		margin: theme.spacing.unit,
		backgroundColor: '#4C9900',
		color: '#FFFFFF'
	}
});

class Attendance extends Component {
	constructor(props) {
		super(props);
		this.state = {
			settings: this.props.settings,
			start_date: '00/00/00',
			end_date: '00/00/00',
			user_type: this.props.user_type,
			isApplyForLeave: false,
			emp_id: this.props.emp_id,
			isExport: false,
			attendance: [],
			leaves: [],
			value: 0,
			isAddNew: false,
			isEdit: false,
			data_approved: [],
			data_verify: []
		};
	}

	handleChange = (event, value) => {
		if (value > 0) {
			if (this.state.leaves.length < 1) {
				this.fetchLeaves();
			}
		}
		this.setState({ value });
	};

	componentWillMount() {
		this.fetchAttendance();
	}

	fetchAttendance = () => {
		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');

		const { emp_id } = this.state;
		axios
			.post('', {
				action: 'attendance',
				user_id: emp_id
			})
			.then((res) => {
				const data = res.data.data;
				const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
					this.setState({ attendance: responseString.data });
				} else {
					console.log('Data Not found');
				}
			});
	};

	fetchLeaves = () => {
		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');

		const { emp_id } = this.state;

		axios
			.post('', {
				action: 'leaves',
				user_id: emp_id
			})
			.then((res) => {
				const data = res.data.data;
				const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
					this.setState({ leaves: responseString.data });
				} else {
					console.log('Data Not found');
				}
			});
	};

	onTapAttendanceCapture = () => {
		const { emp_id } = this.state;
		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		axios
			.post('', {
				action: 'capture-attendance',
				user_id: emp_id
			})
			.then((res) => {
				const responseString = JSON.parse(JSON.stringify(res.data));

				if (responseString.status === 200) {
					this.setState({
						isDone: true,
						showAlert: true,
						msg: responseString.status_message,
						title: 'Atendance Capture'
					});
				} else if (responseString.status === 202) {
					this.setState({
						isDone: true,
						showAlert: true,
						msg: responseString.status_message,
						title: 'Atendance Capture'
					});
				} else {
					this.setState({
						showAlert: true,
						msg: 'Opps something went wrong with Attendance capture!',
						title: 'Attendance Error'
					});
				}
			});
	};

	//ALERT
	onDismiss = () => {
		this.setState({ showAlert: false });
	};

	onOkay = () => {
		this.setState({ showAlert: false });
		if (this.state.isDone) {
			if (this.state.value > 0) {
				this.fetchLeaves();
			} else {
				this.fetchAttendance();
			}
		}
	};

	onTapApplyLeaves = () => {
		this.setState({ isApplyForLeave: true });
	};

	onTapBack() {
		this.setState({ isApplyForLeave: false });

		if (this.state.value > 0) {
			this.fetchLeaves();
		} else {
			this.fetchAttendance();
		}
	}

	onTapApproveLeaves = (e) => {
		const { leave_id } = this.state;

		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		axios
			.post('', {
				action: 'approve-leaves',
				leave_id: leave_id,
				status: 'approved'
			})
			.then((res) => {
				const responseString = JSON.parse(JSON.stringify(res.data));

				if (responseString.status === 200) {
					this.setState({
						showAlert: true,
						isDone: true,
						msg: 'Updated Leaves status',
						title: 'Leaves Approval'
					});
				} else {
					this.setState({
						showAlert: true,
						msg: 'Opps something went wrong with Leve Approval!',
						title: 'Leaves Approval'
					});
				}
			});
	};

	onTapRejectLeaves = (e) => {
		const { leave_id } = this.state;

		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		axios
			.post('', {
				action: 'approve-leaves',
				leave_id: leave_id,
				status: 'rejected'
			})
			.then((res) => {
				const responseString = JSON.parse(JSON.stringify(res.data));

				if (responseString.status === 200) {
					this.setState({
						showAlert: true,
						isDone: true,
						msg: 'Updated Leaves status',
						title: 'Leaves Approval'
					});
				} else {
					this.setState({
						showAlert: true,
						msg: 'Opps something went wrong with Leve Approval!',
						title: 'Leaves Approval'
					});
				}
			});
	};

	onEditPartner(partnerId) {
		console.log(`Partner ID ${partnerId}`);
		this.setState({ isEdit: true, owner_id: partnerId });
	}

	handleCollapse = (panel, n) => (event, expanded) => {
		this.setState({
			leave_id: n.id,
			expanded: expanded ? panel : false
		});
	};

	handleRemarksChanges = (e) => {
		this.setState({
			remarks: e.target.value
		});
	};

	handleStatus = (status) => {
		const { classes } = this.props;

		if (status == 'pending') {
			return <Chip label={status} className={classes.chipYellow} />;
		} else if (status == 'rejected') {
			return <Chip label={status} className={classes.chipRed} />;
		} else if (status == 'approved') {
			return <Chip label={status} className={classes.chipGreen} />;
		}
	};

	onTapExport() {
		this.setState({ isExport: true });
	}

	onTapDownload() {

		const { start_date, end_date, emp_id } = this.state;

		if (start_date == '00/00/00') {
			this.setState({
				showAlert: true,
				msg: 'Please Select Start Date',
				title: 'Start Date is Empty!'
			});
			return;
		}

		if (end_date == '00/00/00') {
			this.setState({
				showAlert: true,
				msg: 'Please Select Ennd Date',
				title: 'End Date is Empty!'
			});
			return;
		}

		this.setState({ isExport: false });

		const reportUrl =
			baseURL + 'export_report.php?mode=2&emp_id=' + emp_id + '&s_date=' + start_date + '&e_date=' + end_date;
		window.open(reportUrl, '_self'); //to open new page
	}

	handleTextChanges = (event) => {
		if (event.target.id == 'start-date') {
			this.setState({ start_date: event.target.value });
		} else if (event.target.id == 'end-date') {
			this.setState({ end_date: event.target.value });
		}
	};

	leavesCollapseView() {
		const { classes } = this.props;
		const { expanded, leaves, remarks, user_type } = this.state;

		return (
			<div>
				{leaves.map((n) => {
					return (
						<ExpansionPanel expanded={expanded === n.id} onChange={this.handleCollapse(n.id, n)}>
							<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
								<Typography className={classes.heading}>
									{n.title}
									{this.handleStatus(n.status)}
								</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<Grid container spacing={24}>
									<Grid item xs={9}>
										<FormControl>
											<Typography paragraph>{n.details}</Typography>
											{user_type === 'Admin' ? (
												<div>
													<Button
														id="approve"
														variant="extendedFab"
														color="secondary"
														className={classes.button}
														onClick={this.onTapApproveLeaves.bind(this)}
													>
														Approve <DoneIcon className={classes.rightIcon} />
													</Button>

													<Button
														id="reject"
														variant="extendedFab"
														color="secondary"
														className={classes.button}
														onClick={this.onTapRejectLeaves.bind(this)}
													>
														Reject <DoneIcon className={classes.rightIcon} />
													</Button>
												</div>
											) : (
												''
											)}
										</FormControl>
									</Grid>
									<Grid item xs={3}>
										<FormControl>
											<TextField
												id="name"
												label="Employee Name"
												className={classes.textField}
												value={n.name}
												margin="normal"
												variant="outlined"
												disabled="true"
											/>

											<TextField
												id="apply-date"
												label="Apply Date"
												className={classes.textField}
												value={moment(n.date).format('Do MMM YYYY')}
												margin="normal"
												variant="outlined"
												disabled="true"
											/>

											<TextField
												id="leave-till"
												label="Leaves Till"
												className={classes.textField}
												value={
													moment(n.leaves_from).format('Do MMM') +
													' - ' +
													moment(n.leaves_to).format('Do MMM')
												}
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

	attandanceExportUi = () => {
		const { classes } = this.props;

		const { isExport, start_date, end_date } = this.state;

		return (
			<div>
				{isExport == false ? (
					<Button
						variant="extendedFab"
						color="secondary"
						className={classes.btnRightA}
						onClick={this.onTapExport.bind(this)}
					>
						Export Attendance
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
			</div>
		);
	};

	render() {
		const { classes } = this.props;
		const { value, isApplyForLeave, attendance, showAlert, title, msg, emp_id, user_type, settings } = this.state;

		const { apply_leaves } = settings;

		if (isApplyForLeave) {
			return (
				<CardDiv title={'Apply For Leaves'}>
					<ApplyLeaves emp_id={emp_id} onTapBack={this.onTapBack.bind(this)} />
				</CardDiv>
			);
		} else {
			return (
				<CardDiv title={'Attendance Report & Leaves'}>
					<Alert
						open={showAlert}
						onCancel={this.onOkay.bind(this)}
						onOkay={this.onOkay.bind(this)}
						title={title}
						msg={msg}
					/>

					<Tabs
						value={value}
						onChange={this.handleChange}
						scrollable
						scrollButtons="on"
						indicatorColor="secondary"
						textColor="secondary"
					>
						<Tab label="Attendance List" icon={<AttendanceListIcon />} />
						<Tab label="Leaves" icon={<ApprovedIcon />} />
					</Tabs>

					{value === 0 && (
						<div>
							<TabContainer>
								{user_type == 'Admin' ? (
									this.attandanceExportUi()
								) : (
									<Button
										variant="extendedFab"
										color="secondary"
										className={classes.btnRightA}
										onClick={this.onTapAttendanceCapture.bind(this)}
									>
										Attendance <AttendanceIcon className={classes.rightIcon} />
									</Button>
								)}
								<AttendanceTable
									onEdit={this.onEditPartner.bind(this)}
									isEdit={true}
									data={attendance}
								/>
							</TabContainer>
						</div>
					)}
					{value === 1 && (
						<TabContainer>
							{user_type === 'Admin' ? (
								''
							) : (
								<div>
									{apply_leaves == 1 ? (
										<Button
											variant="extendedFab"
											color="secondary"
											className={classes.btnRightA}
											onClick={this.onTapApplyLeaves.bind(this)}
										>
											Apply Leave <LeaveIcon className={classes.rightIcon} />
										</Button>) : ('')}
								</div>
							)}

							{this.leavesCollapseView()}
						</TabContainer>
					)}
				</CardDiv>
			);
		}
	}
}

Attendance.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Attendance);
