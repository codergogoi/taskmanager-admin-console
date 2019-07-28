import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Avatar } from '@material-ui/core';
import Button from '@material-ui/core/Button';

// App Classes
import ManageTask from '../Tasks/ManageTask';

//CSS Module
const styles = (theme) => ({
	container: {
		flex: 1,
		display: 'flex',
		flexWrap: 'wrap',
		flexDirection: 'row'
	},
	formControl: {
		margin: theme.spacing.unit
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: 300
	},
	button: {
		margin: theme.spacing.unit
	},
	leftIcon: {
		marginRight: theme.spacing.unit
	},
	rightIcon: {
		marginLeft: theme.spacing.unit
	},
	iconSmall: {
		fontSize: 20
	},
	avatar: {
		margin: 0,
		width: 120,
		height: 120
	},
	paper: {
		padding: theme.spacing.unit * 2,
		height: 150,
		textAlign: 'center',
		color: theme.palette.text.secondary,
		alignItems: 'center',
		justify: 'center',
		fontSize: '20'
	}
});

//Main Class
class Applications extends Component {

	constructor(props){
		super(props);
		this.state = {
			user_type: this.props.user_type,
			user: this.props.user,
			spacing: '16'
		};

	}
	

	profileUI = () => {
		const { classes } = this.props;
		const {  user_type } = this.state;

		return (
			<div className={classes.root}>
				<Grid container spacing={24}>
					{user_type === 'Admin' ? (
						<Grid item xs={3}>
							<li>
								<Link to="/manage-employee">
									<Button className={classes.paper}>
										<Avatar
											alt="Manage Employee"
											src="/manage_employee.png"
											className={classNames(classes.avatar)}
										/>Manage Employee
									</Button>
								</Link>
							</li>
						</Grid>
					) : (
						''
					)}

					<Grid item xs={3}>
						<li>
							<Link to="/activity">
								<Button className={classes.paper}>
									<Avatar
										alt="Activity"
										src="/activity_timeline.png"
										className={classNames(classes.avatar)}
									/>Activity Timeline
								</Button>
							</Link>
						</li>
					</Grid>

					{user_type === 'Admin' ? (
						<Grid item xs={3}>
							<li>
								<Link to="/manage-task">
									<Button className={classes.paper} onClick={this.onTapOptions}>
										<Avatar
											alt="Jayanta"
											src="/manage_task.png"
											className={classNames(classes.avatar)}
										/>
										Manage Task
									</Button>
								</Link>
							</li>
						</Grid>
					) : (
						''
					)}
					<Grid item xs={3}>
						<li>
							<Link to="/task-details">
								<Button className={classes.paper}>
									<Avatar
										alt="Jayanta"
										src="/task_details.png"
										className={classNames(classes.avatar)}
									/>
									Task Details
								</Button>
							</Link>
						</li>
					</Grid>
					<Grid item xs={3}>
						<li>
							<Link to="/progress-report">
								<Button className={classes.paper}>
									<Avatar
										alt="Jayanta"
										src="/progress_report.png"
										className={classNames(classes.avatar)}
									/>Progress Report
								</Button>
							</Link>
						</li>
					</Grid>
					<Grid item xs={3}>
						<li>
							<Link to="/attendance">
								<Button className={classes.paper}>
									<Avatar
										alt="Attendance"
										src="/attendance_icon.png"
										className={classNames(classes.avatar)}
									/>Attendance
								</Button>
							</Link>
						</li>
					</Grid>
					<Grid item xs={3}>
						<li>
							<Link to="/messages">
								<Button className={classes.paper}>
									<Avatar
										alt="messages"
										src="/messages.png"
										className={classNames(classes.avatar)}
									/>Messages
								</Button>
							</Link>
						</li>
					</Grid>
					{user_type === 'Admin' ? (
						<Grid item xs={3}>
							<li>
								<Link to="/control-panel">
									<Button className={classes.paper}>
										<Avatar
											alt="Control Panel"
											src="/control_panel.png"
											className={classNames(classes.avatar)}
										/>Control Panel
									</Button>
								</Link>
							</li>
						</Grid>
					) : (
						''
					)}
					<Grid item xs={3}>
						<li>
							<Link to="/profile">
								<Button className={classes.paper}>
									<Avatar
										alt="Edit Profile"
										src="/edit_profile.png"
										className={classNames(classes.avatar)}
									/>My Profile
								</Button>
							</Link>
						</li>
					</Grid>
					<Grid item xs={3}>
						<li>
							<Link to="/my-account">
								<Button className={classes.paper}>
									<Avatar
										alt="Account Settings"
										src="/account_settings.png"
										className={classNames(classes.avatar)}
									/>Account Settings
								</Button>
							</Link>
						</li>
					</Grid>
				</Grid>

				<Switch>
					<Route
						exact
						path="/manage_task"
						render={(props) => (
							<ManageTask onLoadMenu={this.onCollapseMenu}  {...props} />
						)}
					/>
				</Switch>
			</div>
		);
	};

	 

	render() {
		const { classes } = this.props;
		return (
			<div>
				<Card className={classes.card}>
					<CardContent>
						<Typography >{this.profileUI()}</Typography>
					</CardContent>
				</Card>
			</div>
		);
	}
}

Applications.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Applications);
