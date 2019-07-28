import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import NativeSelect from '@material-ui/core/NativeSelect';

// Icons
import AddEmployeeIcon from '@material-ui/icons/PersonAdd';
import BackIcon from '@material-ui/icons/ArrowBack';

// App Classes
import axios from 'axios';
import Alert from '../common/Alert';
import { baseURL } from '../AppConst';


// CSS Module
const styles = (theme) => ({
	root: {
		width: '90%'
	},
	groupForm: {
		width: '100%',
		flexDirection: 'column'
	},
	formContent: {
		width: '45%',
		backgroundColor: '#66ffcc',
		display: 'flex'
	},
	button: {
		marginTop: theme.spacing.unit,
		marginRight: theme.spacing.unit
	},

	input: {
		display: 'none'
	},
	actionsContainer: {
		marginTop: 30,
		marginBottom: theme.spacing.unit * 2
	},
	resetContainer: {
		padding: theme.spacing.unit * 3
	},
	formControl: {
		width: '50%',
		backgroundColor: '#663354',
		display: 'flex',
		margin: theme.spacing.unit
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: 300
	},
	formInputs: {
		width: '90%',
		backgroundColor: '#FF3322',
		flexDirection: 'row'
	},
	groupInputs: {
		width: '90%',
		backgroundColor: '#dd6655'
	},
	selectEmpty: {
		marginTop: theme.spacing.unit * 2,
		marginLeft: 10
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

function getSteps() {
	return [ 'Employee Details', 'Finish' ];
}

class AddEmployee extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			emp_id: 0,
			first_name: '',
			last_name: '',
			email_id: '',
			phone_no: '',
			address: '',
			designation: '',
			date_of_joining: '0000/00/00',
			current_employee: this.props.current_employee,
			isEdit: this.props.isEdit,
			activeStep: 0
		};
	}

	componentWillMount() {
		const { current_employee, isEdit } = this.state;

		if (isEdit) {
			this.setState({
				emp_id: current_employee.id,
				first_name: current_employee.first_name,
				last_name: current_employee.last_name,
				email_id: current_employee.email,
				phone_no: current_employee.phone,
				address: current_employee.address,
				designation: current_employee.designation,
				date_of_joining: current_employee.date_of_joining
			});
		}
	}

	//Utility & Validation
	validateEmail(email) {
		// false is invalid Email
		const pattern = /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
		const result = pattern.test(email);
		return result;
	}

	mobileValidate(text) {
		const reg = /^[0]?[789]\d{9}$/;
		if (reg.test(text) === false) {
			this.setState({
				mobilevalidate: false,
				telephone: text
			});
			return false;
		} else {
			this.setState({
				mobilevalidate: true,
				telephone: text,
				message: ''
			});
			return true;
		}
	}

	handleNext = () => {
		const { activeStep } = this.state;

		if (activeStep === 0) {
			this.onTapNext();
		} else if (activeStep === 1) {
			this.onPostUpload();
		} else {
			this.handleReset();
		}
	};

	//ALERT
	onDismiss = () => {
		this.setState({ showAlert: false });
	};

	onOkay = () => {
		this.setState({ showAlert: false });
		if (this.state.isDone) {
			this.props.onTapBack();
		}
	};

	handleReset = () => {
		this.setState({
			activeStep: 0
		});
	};

	handleDesignation = (event) => {
		this.setState({ designation: event.target.value });
	};

	onTapBack = () => {
		this.props.onTapBack();
	};

	// Post data to Server
	onTapNext = () => {
		if (this.state.isEdit) {
			this.onEditEmployee();
		} else {
			this.onRegisterNewEmployee();
		}
	};

	onRegisterNewEmployee() {
		const { first_name, last_name, email_id, phone_no, address, designation, date_of_joining, isEdit } = this.state;

		if (first_name.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please provide first name',
				title: 'All Fields are Mandatory!'
			});
			return;
		}

		if (last_name.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please provide last name',
				title: 'All Fields are Mandatory!'
			});
			return;
		}

		if (this.validateEmail(email_id) === false) {
			this.setState({
				showAlert: true,
				msg: 'Please provide email id',
				title: 'All Fields are Mandatory!'
			});
			return;
		}

		if (phone_no.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please provide phone number',
				title: 'All Fields are Mandatory!'
			});
			return;
		}

		if (date_of_joining === '0000/00/00') {
			this.setState({
				showAlert: true,
				msg: 'Please provide date of Joining',
				title: 'All Fields are Mandatory!'
			});
			return;
		}

		if (address.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please provide address',
				title: 'All Fields are Mandatory!'
			});
			return;
		}

		if (designation.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please select Designation',
				title: 'All Fields are Mandatory!'
			});
			return;
		}

		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		axios
			.post('', {
				action: 'register',
				first_name: first_name,
				last_name: last_name,
				email_id: email_id,
				phone_no: phone_no,
				address: address,
				designation: designation,
				date_of_joining: date_of_joining
			})
			.then((res) => {
				const responseString = JSON.parse(JSON.stringify(res.data));

				console.log('response' + responseString);

				if (responseString.status === 200) {
					console.log(`${responseString.status} id ${responseString.id}`);
					this.setState({
						partner_id: responseString.id,
						showAlert: true,
						msg: 'Empoyee Registered successfully!',
						title: 'Register Employee'
					});
					this.setState((state) => ({
						activeStep: state.activeStep + 1,
						first_name: '',
						last_name: '',
						email_id: '',
						phone_no: '',
						address: '',
						designation: '',
						date_of_joining: '0000/00/00'
					}));
				} else if (responseString.status === 202) {
					this.setState({
						showAlert: true,
						msg: 'The Employee Already Exist with the provided email id and contact number!',
						title: 'Add New Employee'
					});
				} else {
					this.setState({
						showAlert: true,
						msg: 'Opps something went wrong with Registration!',
						title: 'Add New Employee'
					});
				}
			});
	}

	onEditEmployee() {
		const { first_name, last_name, email_id, phone_no, address, designation, date_of_joining, emp_id } = this.state;

		if (first_name.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please provide first name',
				title: 'All Fields are Mandatory!'
			});
			return;
		}

		if (last_name.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please provide last name',
				title: 'All Fields are Mandatory!'
			});
			return;
		}

		if (this.validateEmail(email_id) === false) {
			this.setState({
				showAlert: true,
				msg: 'Please provide email id',
				title: 'All Fields are Mandatory!'
			});
			return;
		}

		if (phone_no.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please provide phone no',
				title: 'All Fields are Mandatory!'
			});
			return;
		}

		if (date_of_joining.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please provide date of Joining',
				title: 'All Fields are Mandatory!'
			});
			return;
		}

		if (address.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please provide address',
				title: 'All Fields are Mandatory!'
			});
			return;
		}

		if (designation.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please select Designation',
				title: 'All Fields are Mandatory!'
			});
			return;
		}

		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		axios
			.post('', {
				action: 'edit-user',
				user_id: emp_id,
				first_name: first_name,
				last_name: last_name,
				email_id: email_id,
				phone_no: phone_no,
				address: address,
				designation: designation,
				date_of_joining: date_of_joining,
				token: 'admintoken'
			})
			.then((res) => {
				const responseString = JSON.parse(JSON.stringify(res.data));

				if (responseString.status === 200) {
					this.setState({
						showAlert: true,
						isDone: true,
						msg: 'Updated successfully!',
						title: 'Edit Employee'
					});
				} else {
					this.setState({
						showAlert: true,
						msg: 'Opps something went wrong with Edit Emplpoyee!',
						title: 'Edit Employee'
					});
				}
			});
	}

	onPostUpload = () => {
		this.setState((state) => ({
			activeStep: state.activeStep + 1
		}));
	};

	handleTextChanges = (event) => {
		if (event.target.id == 'first-name') {
			this.setState({ first_name: event.target.value });
		} else if (event.target.id == 'last-name') {
			this.setState({ last_name: event.target.value });
		} else if (event.target.id == 'email-id') {
			this.setState({ email_id: event.target.value });
		} else if (event.target.id == 'phone-no') {
			this.setState({ phone_no: event.target.value });
		} else if (event.target.id == 'address') {
			this.setState({ address: event.target.value });
		} else if (event.target.id == 'designation') {
			this.setState({ designation: event.target.value });
		} else if (event.target.id == 'date-of-joining') {
			this.setState({ date_of_joining: event.target.value });
		}
	};

	//Add Partner
	registerEmployeeUI = () => {
		const { classes } = this.props;
		const { first_name, last_name, email_id, phone_no, address, designation, date_of_joining } = this.state;

		return (
			<Grid container spacing={24}>
				<Grid item xs={6}>
					<FormControl>
						<TextField
							id="first-name"
							label="First Name"
							className={classes.textField}
							type="text"
							required="true"
							autoComplete="First Name"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={first_name}
						/>
						<TextField
							id="last-name"
							required="true"
							label="Last Name"
							className={classes.textField}
							type="text"
							autoComplete="Last Name"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={last_name}
						/>
						<TextField
							id="email-id"
							label="Email ID"
							required="true"
							className={classes.textField}
							type="email"
							autoComplete="Email ID"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={email_id}
						/>
						<TextField
							id="phone-no"
							required="true"
							pattern="[0-9]*"
							label="Phone Number"
							className={classes.textField}
							type="phone"
							autoComplete="Phone No"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={phone_no}
						/>
					</FormControl>
				</Grid>
				<Grid item xs={6}>
					<FormControl>
						<TextField
							id="date-of-joining"
							required="true"
							label="Date Of Joining"
							className={classes.textField}
							type="date"
							autoComplete="Date Of Joining"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={date_of_joining}
						/>
						<TextField
							id="address"
							label="Address"
							required="true"
							multiline="true"
							rows="4"
							className={classes.textField}
							type="text"
							autoComplete="Address"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={address}
						/>

						<NativeSelect
							className={classes.selectEmpty}
							required="true"
							onChange={this.handleDesignation.bind(this)}
							value={designation}
						>
							<option value="" disabled>
								Select Designation
							</option>
							<option value="Admin">Manager</option>
							<option value="employee">Employee</option>
							<option value="sales_executive">Sales Executive</option>
							<option value="worker">Worker</option>
						</NativeSelect>
					</FormControl>
				</Grid>
			</Grid>
		);
	};

	partnerUI = (index) => {
		if (index === 0) {
			return this.registerEmployeeUI();
		}
	};

	render() {
		const { classes } = this.props;
		const steps = getSteps();
		const { activeStep, showAlert, title, msg, isEdit } = this.state;

		return (
			<div className={classes.root}>
				<Button
					variant="extendedFab"
					color="secondary"
					className={classes.btnRightA}
					onClick={this.onTapBack.bind(this)}
				>
					Back <BackIcon className={classes.rightIcon} />
				</Button>

				<Alert
					open={showAlert}
					onCancel={this.onOkay.bind(this)}
					onOkay={this.onOkay.bind(this)}
					title={title}
					msg={msg}
				/>
				<Stepper activeStep={activeStep} orientation="vertical">
					{steps.map((label, index) => {
						return (
							<Step key={label}>
								<StepLabel>{label}</StepLabel>
								<StepContent>
									<Typography>{this.partnerUI(index)}</Typography>
									<div className={classes.actionsContainer}>
										<div>
											<Button
												variant="contained"
												color="primary"
												onClick={this.handleNext}
												className={classes.button}
											>
												{activeStep === steps.length - 1 ? 'Finish' : 'Save'}
											</Button>
										</div>
									</div>
								</StepContent>
							</Step>
						);
					})}
				</Stepper>
				{activeStep === steps.length && (
					<Paper square elevation={0} className={classes.resetContainer}>
						<Button
							variant="extendedFab"
							color="secondary"
							className={classes.button}
							onClick={this.handleReset.bind(this)}
						>
							Register More <AddEmployeeIcon className={classes.rightIcon} />
						</Button>
					</Paper>
				)}
			</div>
		);
	}
}

AddEmployee.propTypes = {
	classes: PropTypes.object
};

export default withStyles(styles)(AddEmployee);
