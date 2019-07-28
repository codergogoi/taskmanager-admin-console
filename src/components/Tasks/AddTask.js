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

//App Classes
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
		width: 400
	},

	selectionField: {
		marginTop: theme.spacing.unit * 5,
		marginLeft: 10
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
	return [ 'Task Details', 'Add More Task' ];
}

class AddTask extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			task_id: 0,
			user_id: 0,
			task_title: '',
			details: '',
			deadline_date: '0000/00/00',
			priority: 10,
			task_point: 10,
			task_type: 'Task',
			other_note: '',
			activeStep: 0
		};
	}

	handleNext = () => {
		const { activeStep } = this.state;

		if (activeStep === 0) {
			this.onTapNext();
		} else {
			this.handleReset();
		}
	};

	

	// RESET
	handleReset = () => {
		this.setState({
			activeStep: 0
		});
	};

	onTapBack = () => {
		this.props.onTapBack();
	};

	// Post data to Server
	onTapNext = () => {
		const { task_title, details, deadline_date, priority, task_point, task_type, other_note, user_id } = this.state;

		if (task_title.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please provide Title',
				title: 'All Fields are Mandatory!'
			});
			return;
		}

		if (details.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please task details',
				title: 'All Fields are Mandatory!'
			});
			return;
		}

		if (deadline_date === '0000/00/00') {
			this.setState({
				showAlert: true,
				msg: 'Please provide deadline date',
				title: 'All Fields are Mandatory!'
			});
			return;
		}

		if (priority.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please select task priority',
				title: 'All Fields are Mandatory!'
			});
			return;
		}

		if (task_type.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please select task type',
				title: 'All Fields are Mandatory!'
			});
			return;
		}

		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		axios
			.post('', {
				action: 'add-task',
				title: task_title,
				deadline: deadline_date,
				description: details,
				priority: priority,
				points: task_point,
				type: task_type,
				remarks: other_note,
				owner: user_id
			})
			.then((res) => {
				const responseString = JSON.parse(JSON.stringify(res.data));
				console.log('response' + responseString);

				if (responseString.status === 200) {
					this.setState({
						showAlert: true,
						msg: 'Task added successfully',
						title: 'Add new Task',
						task_title: '',
						details: '', 
						deadline_date: '0000/00/00',
						priority: '',
						task_point: '',
						task_type: '', 
						other_note: ''
					});
					this.setState((state) => ({
						activeStep: state.activeStep + 1
					}));
				} else {
					this.setState({
						showAlert: true,
						msg: 'Opps something went wrong with Add Task!',
						title: 'Add New Task'
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
		if (event.target.id == 'taskTitle') {
			this.setState({ task_title: event.target.value });
		} else if (event.target.id == 'taskDescription') {
			this.setState({ details: event.target.value });
		} else if (event.target.id == 'other-note') {
			this.setState({ other_note: event.target.value });
		} else if (event.target.id == 'deadline_date') {
			this.setState({ deadline_date: event.target.value });
		} else if (event.target.id == 'task_type') {
			this.setState({ task_type: event.target.value });
		} else if (event.target.id == 'taskPriority') {
			this.setState({ priority: event.target.value });
		} else if (event.target.id == 'task_points') {
			this.setState({ task_point: event.target.value });
		}
	};

	//Add Task
	addTaskUI = () => {
		const { classes } = this.props;
		const { task_title, details, deadline_date, priority, task_point, task_type, other_note } = this.state;

		return (
			<Grid container spacing={24}>
				<Grid item xs={6}>
					<FormControl>
						<TextField
							id="taskTitle"
							label="Task Title"
							className={classes.textField}
							type="text"
							required="true"
							autoComplete="Task Title"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={task_title}
						/>
						<TextField
							id="taskDescription"
							label="Task Description"
							type="text"
							required="true"
							multiline
							rows="7"
							className={classes.textField}
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={details}
						/>

						<TextField
							id="other-note"
							label="Remarks"
							className={classes.textField}
							type="text"
							multiline
							rows="4"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={other_note}
						/>
					</FormControl>
				</Grid>
				<Grid item xs={6}>
					<FormControl>
						<TextField
							id="deadline_date"
							label="Deadline"
							required="true"
							className={classes.selectionField}
							type="date"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={deadline_date}
						/>

						<NativeSelect
							label="Task Type"
							required="true"
							className={classes.selectionField}
							id="task_type"
							onChange={this.handleTextChanges.bind(this)}
							value={task_type}
						>
							<option value="" disabled selected>
								Task Type
							</option>
							<option value="Daily Task">Daily Task</option>
							<option value="Wishlist">Wishlist</option>
						</NativeSelect>

						<NativeSelect
							className={classes.selectionField}
							id="task_points"
							required="true"
							onChange={this.handleTextChanges.bind(this)}
							value={task_point}
						>
							<option value="" disabled>
								Task Points
							</option>
							<option value="5">5</option>
							<option value="10">10</option>
							<option value="20">20</option>
							<option value="30">30</option>
							<option value="40">40</option>
							<option value="50">50</option>
						</NativeSelect>

						<NativeSelect
							className={classes.selectionField}
							id="taskPriority"
							required="true"
							onChange={this.handleTextChanges.bind(this)}
							value={priority}
						>
							<option value="" disabled>
								Select priority
							</option>
							<option value="0">Normal</option>
							<option value="1">High</option>
							<option value="2">Critical</option>
						</NativeSelect>
					</FormControl>
				</Grid>
			</Grid>
		);
	};

	taskUI = (index) => {
		if (index === 0) {
			return this.addTaskUI();
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
									<Typography>{this.taskUI(index)}</Typography>
									<div className={classes.actionsContainer}>
										<div>
											<Button
												variant="contained"
												color="primary"
												onClick={this.handleNext}
												className={classes.button}
											>
												{activeStep === steps.length - 1 ? 'Add More Task' : 'Add Task'}
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
							Add More Task <AddEmployeeIcon className={classes.rightIcon} />
						</Button>
					</Paper>
				)}
			</div>
		);
	}

	// Utility

	//ALERT
	onDismiss = () => {
		this.setState({ showAlert: false });
	};

	onOkay = () => {
		this.setState({ showAlert: false });
	};
	
}

AddTask.propTypes = {
	classes: PropTypes.object
};

export default withStyles(styles)(AddTask);
