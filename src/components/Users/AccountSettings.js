import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Grid, CardHeader, Card, CardContent, Typography, Avatar } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


//Icons
import SaveIcon from '@material-ui/icons/Save';


//App Classes
import axios from 'axios';
import { baseURL } from '../AppConst';
import Alert from '../common/Alert';


//Style Sheet
const styles = (theme) => ({
	container: {
		flex: 1,
		display: 'flex',
		flexWrap: 'wrap',
		flexDirection: 'row'
	},
	card: {
		height: 580
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
	buttonSaveChanges: {
		margin: theme.spacing.unit,
		marginLeft: theme.spacing.unit * 10
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
		width: 200,
		height: 200
	},
	btnRightA: {
		position: 'absolute',
		bottom: theme.spacing.unit * 10,
		left: theme.spacing.unit * 20
	}
});

//Main Class
class AccountSettings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			emp_id: this.props.emp_id,
			email: '',
			curent_password: '',
			new_password: '',
			confirm_password: '',
			designation: '',
			profile_pic: ''
		};
		this.fetchUserProfile.bind(this);
	}

	componentWillMount() {
		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		this.fetchUserProfile();
	}

	//Fetch Task Details

	fetchUserProfile = () => {
		const { emp_id } = this.state;
		axios
			.post('', {
				action: 'view-users',
				user_id: emp_id
			})
			.then((res) => {
				const data = res.data.data;
				const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
					let user = responseString.data[0];
					this.setState({
						user_id: user.id,
						designation: user.designation,
						email: user.email,
						profile_pic: baseURL+user.profile_pic

					});
				} else {
					console.log('Data Not found');
				}
			});
	};

	onTapSave = () => {
		const { user_id, curent_password, new_password, confirm_password } = this.state;

		if (curent_password.length < 5) {
			this.setState({
				showAlert: true,
				msg: 'Password Length must be minimum 5 Characters!',
				title: 'Invalid Password ength'
			});
			return;
		}

		if (new_password.length < 5) {
			this.setState({
				showAlert: true,
				msg: 'New Password Length must be minimum 5 Characters!',
				title: 'Invalid Password ength'
			});

			return;
		}

		if (new_password === confirm_password) {
			axios
				.post('', {
					action: 'edit-user',
					user_id: user_id,
					old_password: curent_password,
					password: new_password
				})
				.then((res) => {
					const response = JSON.parse(JSON.stringify(res.data));
					if (response.status === 200) {
						this.setState({
							showAlert: true,
							msg: 'Password Changed Successfully!',
							title: 'Password Change'
						});
					} else {
						this.setState({
							showAlert: true,
							msg: 'Failed to Change Password!',
							title: 'Password Change'
						});
					}
				});
		} else {
			this.setState({
				showAlert: true,
				msg: 'Confirm Password Does not match!',
				title: 'Change Password'
			});
		}
	};

	handleTextChanges = (e) => {
		if (e.target.id == 'current-password') {
			this.setState({
				curent_password: e.target.value
			});
		} else if (e.target.id == 'new-password') {
			this.setState({
				new_password: e.target.value
			});
		} else if (e.target.id == 'confirm-password') {
			this.setState({
				confirm_password: e.target.value
			});
		}
	};

	profileUI = () => {
		const { classes } = this.props;
		const { email, designation, profile_pic, curent_password, new_password, confirm_password } = this.state;

		return (
			<Grid container spacing={24}>
				<Grid item xs={6}>
					<FormControl>
						<TextField
							id="email-id"
							label="Email ID"
							className={classes.textField}
							type="email"
							disabled="true"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={email}
						/>
						<TextField
							id="current-password"
							label="Current Password"
							className={classes.textField}
							type="password"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={curent_password}
						/>
						<TextField
							id="new-password"
							label="New Password"
							className={classes.textField}
							type="password"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={new_password}
						/>
						<TextField
							id="confirm-password"
							label="Confirm Password"
							className={classes.textField}
							type="password"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={confirm_password}
						/>
					</FormControl>
				</Grid>
				<Grid item xs={6}>
					<FormControl>
						<Avatar alt="No Pic" src={profile_pic} className={classNames(classes.avatar)} />
						<TextField
							id="designation"
							label="Designation"
							className={classes.textField}
							type="text"
							margin="normal"
							disabled="true"
							value={designation}
						/>
					</FormControl>
				</Grid>
			</Grid>
		);
	};

	render() {
		const { classes } = this.props;

		const { showAlert, title, msg } = this.state;

		return (
			<div>
				<Alert
					open={showAlert}
					onCancel={this.onOkay.bind(this)}
					onOkay={this.onOkay.bind(this)}
					title={title}
					msg={msg}
				/>

				<Card className={classes.card}>
					<CardHeader title={this.state.title} />
					<CardContent>
						<Typography component="p">{this.profileUI()}</Typography>
					</CardContent>
					<Button
						variant="extendedFab"
						color="secondary"
						className={classes.buttonSaveChanges}
						onClick={this.onTapSave.bind(this)}
					>
						Save Changes <SaveIcon className={classes.rightIcon} />
					</Button>
				</Card>
			</div>
		);
	}

	//========================= UTILITY ===============================

	//ALERT
	onDismiss = () => {
		this.setState({ showAlert: false });
	};

	onOkay = () => {
		this.setState({ showAlert: false });
	};
}

AccountSettings.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AccountSettings);
