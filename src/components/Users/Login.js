import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import { Component } from 'react';



//App Classes 
import Alert from '../common/Alert';
import axios from 'axios';
import { baseURL } from '../AppConst';

const styles = (theme) => ({
	layout: {
		width: 'auto',
		height: 800,
		display: 'block', // Fix IE11 issue.
		marginLeft: theme.spacing.unit * 3,
		marginRight: theme.spacing.unit * 3,
		[theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
			width: 400,
			marginLeft: 'auto',
			marginRight: 'auto'
		}
	},
	paper: {
		borderRadius: 20,
		marginTop: theme.spacing.unit * 8,
		backgroundColor: 'rgba(255, 255, 255, 0.5)',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
	},
	avatar: {
		margin: theme.spacing.unit,
		backgroundColor: theme.palette.secondary.main,
		width: 80,
		height: 80
	},
	form: {
		width: '100%', // Fix IE11 issue.
		marginTop: theme.spacing.unit
	},
	submit: {
		marginTop: theme.spacing.unit * 3,
		cornerRadius: '10'
	},
	button: {
		marginTop: theme.spacing.unit * 3,
		boxShadow: 'none',
		textTransform: 'none'
	}
});

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userName: '',
			userPwd: '',
			email: '',
			reset_email: '',
			password: '',
			isForgot: false,
			amount: '',
			password: '',
			weight: '',
			weightRange: '',
			showPassword: false,
			spacing: '16'
		};
		this.doLogin = this.doLogin.bind(this);
		this.setUserName = this.setUserName.bind(this);
		this.setPassword = this.setPassword.bind(this);
	}

	doLogin(e) {
		e.preventDefault();
	}

	setUserName(e) {
		this.setState({
			userName: e.target.value
		});
	}

	setPassword(e) {
		this.setState({
			userPwd: e.target.value
		});
	}

	handleChange = (key) => (event, value) => {
		this.setState({
			[key]: value
		});
	};

	handleChange = (prop) => (event) => {
		this.setState({ [prop]: event.target.value });
	};

	handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	handleClickShowPassword = () => {
		this.setState((state) => ({ showPassword: !state.showPassword }));
	};

	//Handle OnTap

	onTapForgotPassword = () => {
		this.setState({ isForgot: true });
	};

	onTapCancel = () => {
		this.setState({ isForgot: false });

	}

	onTapResetPassword = () => {
		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');

		const { reset_email } = this.state;

		if (reset_email === '') {
			this.setState({
				showAlert: true,
				msg: 'Please enter a Valid Email ID',
				title: 'Reset Password Error!'
			});
			return;
		} else {
			axios
				.post('', {
					action: 'forgot-password',
					email_id: reset_email
				})
				.then((res) => {
					const data = res.data.data;
					const status = parseInt(res.data.status);
					if (status === 200) {
						this.setState({
							showAlert: true,
							msg: 'Password Sent to your registred Email ID',
							title: 'Reset Password!',
							isForgot: false
						});
					} else {
						this.setState({
							showAlert: true,
							msg: 'User does not exist with the provided Email ID',
							title: 'Reset Password!',
							isForgot: false
						});
					}
				});
		}
	};

	onTapLogin = () => {
		const { email, password } = this.state;
		if (email.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please enter a Valid Email ID',
				title: 'Login Error!'
			});
			return;
		} else if (password < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please enter your password',
				title: 'login error'
			});
			return;
		}

		this.props.onCheckLogin({ email: email, password: password });
	};

	handleTextChanges = (event) => {
		if (event.target.id == 'email') {
			this.setState({ email: event.target.value });
		} else if (event.target.id == 'password') {
			this.setState({ password: event.target.value });
		} else if (event.target.id == 'reset_email') {
			this.setState({ reset_email: event.target.value });
		}
	};

	render() {
		const { classes } = this.props;

		const { isForgot, email, password, showAlert, title, msg, reset_email } = this.state;

		if (isForgot) {
			return (
				<div>
					<Alert
						open={showAlert}
						onCancel={this.onOkay.bind(this)}
						onOkay={this.onOkay.bind(this)}
						title={title}
						msg={msg}
					/>
					<React.Fragment>
						<CssBaseline />
						<main className={classes.layout}>
							<Paper className={classes.paper}>
								<Typography variant="h5">Forgot Password</Typography>
								<form className={classes.form}>
									<FormControl margin="normal" required fullWidth>
										<TextField
											id="reset_email"
											label="Email ID"
											className={classes.textField}
											type="text"
											required="true"
											autoComplete="email"
											margin="normal"
											onChange={this.handleTextChanges.bind(this)}
											value={reset_email}
										/>
									</FormControl>

									<Button
										variant="extendedFab"
										color="primary"
										aria-label="Delete"
										className={classes.button}
										fullWidth
										onClick={this.onTapResetPassword.bind(this)}
									>
										Reset Password
									</Button>
									<Button
										variant="extendedFab"
										color="primary"
										aria-label="Delete"
										className={classes.button}
										fullWidth
										onClick={this.onTapCancel.bind(this)}
									>
										Cancel
									</Button>
								</form>
							</Paper>
						</main>
					</React.Fragment>
				</div>
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
					<React.Fragment>
						<CssBaseline />
						<main className={classes.layout}>
							<Paper className={classes.paper}>
								<Avatar
									className={classes.avatar}
									alt="user pic"
									src="/default_user.png"
									className={classes.avatar}
								/>
								<Typography variant="h5">User Login</Typography>
								<form className={classes.form}>
									<FormControl margin="normal" required fullWidth>
										<TextField
											id="email"
											label="Email ID"
											className={classes.textField}
											type="text"
											required="true"
											autoComplete="email"
											margin="normal"
											onChange={this.handleTextChanges.bind(this)}
											value={email}
										/>

										<TextField
											id="password"
											label="Password"
											className={classes.textField}
											type="password"
											required="true"
											autoComplete="password"
											margin="normal"
											onChange={this.handleTextChanges.bind(this)}
											value={password}
										/>
									</FormControl>

									<Button
										variant="extendedFab"
										color="primary"
										aria-label="Delete"
										className={classes.button}
										onClick={this.onTapLogin.bind(this)}
										fullWidth
									>
										Sign in
									</Button>

									<Button
										variant="extendedFab"
										color="default"
										aria-label="Delete"
										className={classes.button}
										fullWidth
										onClick={this.onTapForgotPassword.bind(this)}
									>
										Forgot Password
									</Button>
								</form>
							</Paper>
						</main>
					</React.Fragment>
				</div>
			);
		}
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

Login.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Login);

// export default Login;
