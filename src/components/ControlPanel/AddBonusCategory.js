//Common UI
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
		width: '100%',
		backgroundColor: '#663354',
		display: 'flex',
		margin: theme.spacing.unit
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: 500
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
	return [ 'Bonus Details' ];
}

class AddBonusCategory extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			emp_id: this.props.emp_id,
			bonus_title: '',
			bonus_conditions: '',
			bonus_deadline: '0000/00/00',
			bonus_points: 10,
			activeStep: 0
		};
	}


	handleNext = () => {
		const { activeStep } = this.state;

		if (activeStep === 0) {
			this.onTapNext();
		}  else {
			this.handleReset();
		}
	};

	

	handleReset = () => {
		this.setState({
			activeStep: 0
		});
	};

	handleDesignation = (event) => {
		this.setState({ bonus_points: event.target.value });
	};

	// Post data to Server
	onTapNext = () => {
		const { bonus_title,
		bonus_conditions,
		bonus_deadline,
		bonus_points, emp_id } = this.state;


		if (bonus_title.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please provide Bonus Title',
				title: 'All Fields are Mandatory!'
			});
			return;
		}

		if (bonus_conditions.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please provide Bonus Conditions',
				title: 'All Fields are Mandatory!'
			});
			return;
		}

		if (bonus_deadline === '0000/00/00') {
			this.setState({
				showAlert: true,
				msg: 'Please provide Bonus Deadline',
				title: 'All Fields are Mandatory!'
			});
			return;
		}

		if (bonus_points.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please provide Bonus qualify points',
				title: 'All Fields are Mandatory!'
			});
			return;
		}


		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		axios
			.post('', {
				action: 'add-bonus',
				bonus_title: bonus_title,
				bonus_conditions: bonus_conditions,
				bonus_deadline: bonus_deadline,
				bonus_qualify_points: bonus_points,
				emp_id: emp_id,

			})
			.then((res) => {
				const responseString = JSON.parse(JSON.stringify(res.data));

				if (responseString.status === 200) {
					this.setState({
						partner_id: responseString.id,
						showAlert: true,
						isDone: true,
						msg: 'Bonus Added Successfully!',
						title: 'Bonus Created!'
					});
					
				}else {
					this.setState({
						showAlert: true,
						msg: 'Opps! something went wrong with Create Bonus!',
						title: 'Bonus Create Error!'
					});
				}
			});

	};

	onPostUpload = () => {
		this.setState((state) => ({
			activeStep: state.activeStep + 1
		}));
	};

	handleTextChanges = (event) => {
		if (event.target.id == 'bonus-title') {
			this.setState({ bonus_title: event.target.value });
		} else if (event.target.id == 'bonus-conditions') {
			this.setState({ bonus_conditions: event.target.value });
		} else if (event.target.id == 'bonus-deadline') {
			this.setState({ bonus_deadline: event.target.value });
		} else if (event.target.id == 'bonus-points') {
			this.setState({ bonus_points: event.target.value });
		}  
	};

	//Add Bonus
	addBonusUI = () => {
		const { classes } = this.props;

		const { bonus_title,
			bonus_conditions,
			bonus_deadline,
			bonus_points} = this.state;

		return (
			<Grid container spacing={24}>
				<Grid item xs={8}>
					<FormControl>
						<TextField
							id="bonus-title"
							label="Bonus Title"
							className={classes.textField}
							type="text"
							required="true"
							autoComplete="Bonus Title"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={bonus_title}
						/>
						<TextField
							id="bonus-conditions"
							label="Bonus Conditions"
							className={classes.textField}
							type="text"
							multiline="true"
							rows="5"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={bonus_conditions}
						/>

						<TextField
							id="bonus-deadline"
							label="Bonus Deadline"
							className={classes.textField}
							type="date"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={bonus_deadline}
						/>

						<NativeSelect
							className={classes.selectEmpty}
							id="bonus-points"
							onChange={this.handleDesignation.bind(this)}
							value={bonus_points}
						>
							<option value="" disabled>
								Bonus Qualify Points
							</option>
							<option value="50">50</option>
							<option value="60">60</option>
							<option value="70">70</option>
							<option value="80">80</option>
							<option value="90">90</option>
							<option value="100">100</option>
							<option value="150">150</option>
							<option value="200">200</option>
							<option value="250">250</option>
							<option value="300">300</option>
							<option value="350">350</option>
							<option value="400">400</option>
							<option value="450">450</option>
							<option value="500">500</option>
							<option value="1000">1000</option>
							<option value="2000">2000</option>
							<option value="3000">3000</option>
							<option value="4000">4000</option>
							<option value="5000">5000</option>
						</NativeSelect>

					</FormControl>
				</Grid>
				 
			</Grid>
		);
	};

	

	partnerUI = (index) => {
		if (index === 0) {
			return this.addBonusUI();
		} 
	};

	render() {
		const { classes } = this.props;
		const steps = getSteps();
		const { activeStep, showAlert, title, msg } = this.state;

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
							Add More Bonus <AddEmployeeIcon className={classes.rightIcon} />
						</Button>
					</Paper>
				)}
			</div>
		);
	}

	/////////////////////////////////////////////
	// UTILITY

	//ALERT
	onDismiss = () => {
		this.setState({ showAlert: false });
	};

	onOkay = () => {
		this.setState({ showAlert: false });
		if(this.state.isDone){
			this.props.onTapBack();
		}
	};

	//Go to Back Page
	onTapBack = () => {
		this.props.onTapBack();
	};


}

AddBonusCategory.propTypes = {
	classes: PropTypes.object
};

export default withStyles(styles)(AddBonusCategory);
