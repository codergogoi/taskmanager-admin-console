import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';


// Icons
import SendIcon from '@material-ui/icons/Send';
import BackIcon from '@material-ui/icons/ArrowBack';

// App Classes
import axios from 'axios';
import Alert from '../common/Alert';
import { baseURL } from '../AppConst';

const styles = (theme) => ({
	root: {
		width: '90%',
		height: 600
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
		marginRight: theme.spacing.unit,
		width: 200,
		marginTop: 50
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

class ApplyLeaves extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user_id: this.props.emp_id,
			leave_title: '',
			description: '',
			date_from: '01/01/2019',
			date_to: '01/01/2019'
		};
	}
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

	onTapBack = () => {
		this.props.onTapBack();
	};

	// Post data to Server
	onTapApply = () => {
		const { leave_title, description, date_from, date_to, user_id } = this.state;

		if (leave_title.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please enter Leave Title.',
				title: 'Missing Leave Title!'
			});
			return;
		}

		if (description.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please enter Leave Description.',
				title: 'Missing Leave Description!'
			});
			return;
		}

		if (date_from.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please Select Leave Start date.',
				title: 'Missing Leave Start Date!'
			});
			return;
		}

		if (date_to.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please Select Leave End date.',
				title: 'Missing Leave End Date!'
			});
			return;
		}

		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		axios
			.post('', {
				action: 'apply-leaves',
				user_id: user_id,
				title: leave_title,
				description: description,
				from_date: date_from,
				to_date: date_to
			})
			.then((res) => {
				const responseString = JSON.parse(JSON.stringify(res.data));

				if (responseString.status === 200) {
					console.log(`${responseString.status} id ${responseString.id}`);
					this.setState({
						partner_id: responseString.id,
						showAlert: true,
						isDone: true,
						msg: 'Leaves applyed sucessfully!',
						title: 'Apply For Leaves'
					});
				} else {
					this.setState({
						showAlert: true,
						msg: 'Opps something went wrong with Applying Leaves!',
						title: 'Apply Leaves Error!'
					});
				}
			});
	};

	handleTextChanges = (event) => {
		if (event.target.id == 'title') {
			this.setState({ leave_title: event.target.value });
		} else if (event.target.id == 'description') {
			this.setState({ description: event.target.value });
		} else if (event.target.id == 'from-date') {
			this.setState({ date_from: event.target.value });
		} else if (event.target.id == 'to-date') {
			this.setState({ date_to: event.target.value });
		}
	};

	//Add Partner
	applyLeaveUI = () => {
		const { classes } = this.props;
		const { leave_title, description, date_from, date_to } = this.state;

		return (
			<Grid container spacing={24}>
				<Grid item xs={8}>
					<FormControl>
						<TextField
							id="title"
							label="Leave Subject"
							className={classes.textField}
							type="text"
							required="true"
							autoComplete="Leave Subject"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={leave_title}
						/>
						<TextField
							id="description"
							label="Leaves Description"
							className={classes.textField}
							type="text"
							multiline="true"
							rows="11"
							autoComplete="Description"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={description}
						/>

						<TextField
							id="from-date"
							label="Leave From"
							className={classes.textField}
							type="date"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={date_from}
						/>

						<TextField
							id="to-date"
							label="To Date"
							className={classes.textField}
							type="date"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={date_to}
						/>

						<Button
							variant="extendedFab"
							color="secondary"
							className={classes.button}
							onClick={this.onTapApply.bind(this)}
						>
							Apply For Leaves <SendIcon className={classes.rightIcon} />
						</Button>
					</FormControl>
				</Grid>
				<Grid item xs={4}>
					<FormControl />
				</Grid>
			</Grid>
		);
	};

	render() {
		const { classes } = this.props;
		const { showAlert, title, msg } = this.state;

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

				{this.applyLeaveUI()}
			</div>
		);
	}
}

ApplyLeaves.propTypes = {
	classes: PropTypes.object
};

export default withStyles(styles)(ApplyLeaves);
