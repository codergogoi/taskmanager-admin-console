import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';


//Common UI
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';



//Icons
import DashboardIcon from '@material-ui/icons/Widgets';
import TaskDetailsIcon from '@material-ui/icons/AssignmentInd';
import AddTaskIcon from '@material-ui/icons/PlaylistAdd';
import ProgressReportIcon from '@material-ui/icons/EventNote';
import LeveAttendenceIcon from '@material-ui/icons/Fingerprint';
import ControlPanelIcon from '@material-ui/icons/Security';
import SignOutIcon from '@material-ui/icons/ExitToApp';
import MailIcon from '@material-ui/icons/Mail';
import ManageEmployeeIcon from '@material-ui/icons/GroupAdd';
import MenuIcon from '@material-ui/icons/Menu';
import ActivityIcons from '@material-ui/icons/Forum';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
 

//App Classes 
import Profile from './Users/Profile';
import ManageTask from './Tasks/ManageTask';
import TaskDetails from './Tasks/TaskDetails';
import ProgressReports from './Reports/ProgressReports';
import Attendance from './Users/Attendance';
import Messages from './Messages/Messages';
import ControlPanel from './ControlPanel/ControlPanel';
import AccountSettings from './Users/AccountSettings';
import Applications from './ControlPanel/Applications';
import ManageEmployee from './Employees/ManageEmployee';
import Activity from './Activities/LiveActivity';
import axios from 'axios';
import { baseURL } from '../components/AppConst';


const drawerWidth = 240;

//Style Sheet
const styles = (theme) => ({
	root: {
		flexGrow: 1,
		zIndex: 1,
		overflow: 'hidden',
		position: 'relative',
		display: 'flex'
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create([ 'width', 'margin' ], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		backgroundColor: '#483D8B'
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create([ 'width', 'margin' ], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	flex: {
		flex: 1
	},
	menuButton: {
		marginLeft: -12,
		marginRight: 20
	},
	hide: {
		display: 'none'
	},
	drawerPaper: {
		position: 'relative',
		whiteSpace: 'nowrap',
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	drawerPaperClose: {
		overflowX: 'hidden',
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		width: theme.spacing.unit * 7,
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing.unit * 9
		}
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		...theme.mixins.toolbar
	},
	content: {
		flexGrow: 1,
		backgroundColor: 'transparent',
		padding: theme.spacing.unit * 3
	},
	row: {
		display: 'flex',
		justifyContent: 'center'
	},
	avatar: {
		margin: 0
	},
	quickaccess: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-end',
		marginRight: '1%',
		color: 'white'
	},
	margin: {
		margin: theme.spacing.unit * 2
	},
	padding: {
		padding: `0 ${theme.spacing.unit * 2}px`
	}
});

class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			emp_id: '',
			open: false,
			isCollapse: '',
			anchorEl: null,
			alert: false,
			alertTitle: 'User Logout',
			alertMsg: 'Are you sure to Log Out?',
			user: this.props.currentUser,
			settings: [],
		};
		this.onCollapseMenu = this.onCollapseMenu.bind(this);

		this.showAlert = this.showAlert.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
		this.AlertModel = this.AlertModel.bind(this);
		this.cancelAlert = this.cancelAlert.bind(this);
		this.changeOptions = this.changeOptions.bind(this);
	}

	componentWillMount(){
		this.fetchAppSettings();
	}

	onCollapseMenu() {
		if (ReactDOM.findDOMNode(this.refs.toggleMnu) !== null) {
			ReactDOM.findDOMNode(this.refs.toggleMnu).click();
		}
	}

	updateOwnerName(name) {
		this.setState({
			ownerName: name
		});
	}

	handleDrawerOpen = () => {
		if (this.state.open === true) {
			this.setState({ open: false });
		} else {
			this.setState({ open: true });
		}
	};

	handleDrawerClose = () => {
		this.setState({ open: false });
	};

	handleClick = (event) => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleClose = () => {
		this.setState({ anchorEl: null });
	};

	showAlert() {
		this.setState({ anchorEl: null });
		this.setState({ alert: true });
	}

	closeAlert() {
		this.setState({ alert: false });
		this.props.onLogout();
	}

	cancelAlert() {
		this.setState({ anchorEl: null });
		this.setState({ alert: false });
	}

	changeOptions(val) {
		this.props.history.push('/control-panel');
	}

	//Network Calls
	fetchAppSettings = () => {

		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		const { emp_id } = this.state;
		axios
			.post('', {
				action: 'fetch-settings',
			})
			.then((res) => {
				const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
					let settingsData = responseString.data[0];
					this.setState({
						settings: settingsData
					});
				}
			});

	};




	// render UI
	render() {
		const { classes } = this.props;
		const { anchorEl, user, settings } = this.state;

		const { emp_id, user_type, first_name, profile_pic } = user;
		
		console.log(JSON.stringify(user));

		return (
			<Router>
				<div className={classes.root}>
					<AppBar
						position="absolute"
						className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
					>
						<Toolbar disableGutters={!this.state.open}>
							<IconButton color="inherit" aria-label="open drawer" onClick={this.handleDrawerOpen}>
								<MenuIcon />
							</IconButton>
							<Typography variant="title" color="inherit" className={classes.flex}>
								Task Manager - [{user_type} Portal]
							</Typography>

							<div className={classes.quickaccess}>
								<IconButton
									color="inherit"
									aria-label="More"
									aria-owns={anchorEl ? 'long-menu' : null}
									aria-haspopup="true"
									onClick={this.handleClick}
									styles={{ color: 'white' }}
								>
									<MoreVertIcon />
								</IconButton>
								<Menu
									id="simple-menu"
									anchorEl={anchorEl}
									open={Boolean(anchorEl)}
									onClose={this.handleClose}
								>
									<MenuItem onClick={this.handleClose}>
										<Link className="linkName" to={'/profile'}>
											Profile
										</Link>
									</MenuItem>
									<MenuItem onClick={this.handleClose}>
										<Link className="linkName" to={'/my-account'}>
											Change Password
										</Link>
									</MenuItem>
									<MenuItem onClick={this.showAlert}>Logout</MenuItem>
								</Menu>
							</div>
						</Toolbar>
					</AppBar>
					<Drawer
						variant="permanent"
						classes={{
							paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose)
						}}
						open={this.state.open}
					>
						<List>
							<Link className="linkName" to={'/profile'}>
								<ListItem button>
									<ListItemIcon>
										<Avatar
											alt="Jayanta"
											src={baseURL+'img/'+profile_pic}
											className={classNames(classes.avatar)}
										/>
									</ListItemIcon>
									<ListItemText primary={'Hello ' + first_name} />
								</ListItem>
							</Link>
						</List>

						<List to={'/dashboard'}>
							<Link className="linkName" to={'/dashboard'}>
								<ListItem button>
									<ListItemIcon>
										<DashboardIcon />
									</ListItemIcon>
									<ListItemText primary="Dashboard" />
								</ListItem>
							</Link>
						</List>
						{user_type === 'Admin' ? (
							<List>
								<Link className="linkName" to={'/manage-employee'}>
									<ListItem button>
										<ListItemIcon>
											<ManageEmployeeIcon />
										</ListItemIcon>
										<ListItemText primary="Manage Employee" />
									</ListItem>
								</Link>
							</List>
						) : (
							''
						)}

						<List to={'/activity'}>
							<Link className="linkName" to={'/activity'}>
								<ListItem button>
									<ListItemIcon>
										<ActivityIcons />
									</ListItemIcon>
									<ListItemText primary="Activity" />
								</ListItem>
							</Link>
						</List>

						{user_type === 'Admin' ? (
							<List to={'/manage-task'}>
								<Link className="linkName" to={'/manage-task'}>
									<ListItem button>
										<ListItemIcon>
											<AddTaskIcon />
										</ListItemIcon>
										<ListItemText primary="Manage Task" />
									</ListItem>
								</Link>
							</List>
						) : (
							''
						)}

						<List to={'/task'}>
							<Link className="linkName" to={'/task-details'}>
								<ListItem button>
									<ListItemIcon>
										<TaskDetailsIcon />
									</ListItemIcon>
									<ListItemText primary="Task Details" />
								</ListItem>
							</Link>
						</List>

						<List>
							<Link className="linkName" to={'/progress-report'}>
								<ListItem button>
									<ListItemIcon>
										<ProgressReportIcon />
									</ListItemIcon>
									<ListItemText primary="Progress report" />
								</ListItem>
							</Link>
						</List>
						<List>
							<Link className="linkName" to={'/attendance'}>
								<ListItem button>
									<ListItemIcon>
										<LeveAttendenceIcon />
									</ListItemIcon>
									<ListItemText primary="Attendence" />
								</ListItem>
							</Link>
						</List>
						<List>
							<Link className="linkName" to={'/messages'}>
								<ListItem button>
									<ListItemIcon>
										<MailIcon />
									</ListItemIcon>
									<ListItemText primary="Messages" />
								</ListItem>
							</Link>
						</List>
						{user_type === 'Admin' ? (
							<List>
								<Link className="linkName" to={'/control-panel'}>
									<ListItem button>
										<ListItemIcon>
											<ControlPanelIcon />
										</ListItemIcon>
										<ListItemText primary="Control Panel" />
									</ListItem>
								</Link>
							</List>
						) : (
							''
						)}

						<List onClick={this.showAlert}>
							<ListItem button>
								<ListItemIcon>
									<SignOutIcon />
								</ListItemIcon>
								<ListItemText primary="Signout" />
							</ListItem>
						</List>
					</Drawer>
					<main className={classes.content}>
						<div className={classes.toolbar} />
						{this.AlertModel()}
						<Switch>
							<Route
								exact
								path="/dashboard"
								render={(props) => (
									<Applications
										emp_id={emp_id}
										user_type={user_type}
										onLoadMenu={this.onCollapseMenu}
										onChangeOptions={this.changeOptions}
										{...props}
									/>
								)}
							/>

							<Route
								exact
								path="/activity"
								render={(props) => (
									<Activity
										settings={settings}
										emp_id={emp_id}
										onLoadMenu={this.onCollapseMenu}
										{...props}
									/>
								)}
							/>

							<Route
								exact
								path="/manage-task"
								render={(props) => (
									<ManageTask onLoadMenu={this.onCollapseMenu} sayHello={this.showAlert} {...props} />
								)}
							/>
							<Route
								exact
								path="/task-details"
								render={(props) => (
									<TaskDetails
										emp_id={user_type === 'Admin' ? '' : emp_id}
										user_type={user_type}
										onLoadMenu={this.onCollapseMenu}
										{...props}
									/>
								)}
							/>
							<Route
								exact
								path="/progress-report"
								render={(props) => (
									<ProgressReports
										settings = {settings}
										emp_id={user_type === 'Admin' ? '' : emp_id}
										onLoadMenu={this.onCollapseMenu}
										user_type={user_type}
										{...props}
									/>
								)}
							/>
							<Route
								exact
								path="/attendance"
								render={(props) => (
									<Attendance
										settings={settings}
										emp_id={user_type === 'Admin' ? '' : emp_id}
										user_type={user_type}
										onLoadMenu={this.onCollapseMenu}
										{...props}
									/>
								)}
							/>
							<Route
								exact
								path="/messages"
								render={(props) => (
									<Messages
										settings={settings}
										emp_id={emp_id}
										onLoadMenu={this.onCollapseMenu}
										{...props}
									/>
								)}
							/>

							<Route
								exact
								path="/control-panel"
								render={(props) => (
									<ControlPanel
										emp_id={emp_id}
										onLoadMenu={this.onCollapseMenu}
										{...props}
									/>
								)}
							/>
							<Route
								exact
								path="/my-account"
								render={(props) => (
									<AccountSettings
										emp_id={emp_id}
										onLoadMenu={this.onCollapseMenu}
										{...props}
									/>
								)}
							/>

							<Route
								exact
								path="/manage-employee"
								render={(props) => (
									<ManageEmployee
										emp_id={emp_id}
										onLoadMenu={this.onCollapseMenu}
										userName="Jayanta Gogoi"
										{...props}
									/>
								)}
							/>

							<Route
								exact
								path="/profile"
								render={(props) => (
									<Profile
										emp_id={emp_id}
										onLoadMenu={this.onCollapseMenu}
										{...props}
									/>
								)}
							/>

							<Route
								path="/"
								render={(props) => (
									<Applications
										emp_id={emp_id}
										user_type={user_type}
										onLoadMenu={this.onCollapseMenu}
										{...props}
									/>
								)}
							/>
						</Switch>
					</main>
				</div>
			</Router>
		);
	}

	AlertModel() {
		return (
			<div>
				<Dialog
					open={this.state.alert}
					onClose={this.closeAlert}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">{this.state.alertTitle}</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">{this.state.alertMsg}</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.cancelAlert} color="primary">
							Cancel
						</Button>
						<Button onClick={this.closeAlert} color="primary" autoFocus>
							OK
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

Dashboard.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Dashboard);
