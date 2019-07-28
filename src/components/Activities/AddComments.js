import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

// Icons
import BackIcon from '@material-ui/icons/ArrowBack';
import SendIcon from '@material-ui/icons/Send';

//App Classes 
import axios from 'axios';
import Alert from '../common/Alert';
import { baseURL } from '../AppConst';


//CSS Module
const styles = (theme) => ({
	root: {
		width: '90%',
		height: 400
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

	addButton: {
		marginRight: theme.spacing.unit,
		marginLeft: 0,
		marginTop: 20
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

class AddComments extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sender: this.props.emp_id,
			content: '',
			open: false,
			checked: [],
			isExpand: false
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
	onTapSendMessage = () => {
		const { sender, content } = this.state;

		if (content.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please enter message content!',
				title: 'Message Content is required!'
			});
			return;
		}

		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		axios
			.post('', {
				action: 'update-status',
				user_id: sender,
				content: content
			})
			.then((res) => {
				const responseString = JSON.parse(JSON.stringify(res.data));

				if (responseString.status === 200) {
					this.setState({
						showAlert: true,
						isDone: true,
						msg: 'Status Reported Successfully!',
						title: 'Status Report'
					});
				} else {
					this.setState({
						showAlert: true,
						msg: 'Opps! something went wrong with status report!',
						title: 'Status Report'
					});
				}
			});
	};

	handleTextChanges = (event) => {
		if (event.target.id == 'content') {
			this.setState({ content: event.target.value });
		}
	};

	messageUI = () => {
		const { classes } = this.props;
		const { content } = this.state;

		return (
			<Grid container spacing={24}>
				<Grid item xs={6}>
					<FormControl>
						<TextField
							id="content"
							label="Message"
							className={classes.textField}
							type="text"
							multiline="true"
							rows="12"
							autoComplete="Message Description"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={content}
						/>

						<Button
							variant="extendedFab"
							color="secondary"
							className={classes.button}
							onClick={this.onTapSendMessage.bind(this)}
						>
							Update Status <SendIcon className={classes.rightIcon} />
						</Button>
					</FormControl>
				</Grid>
				<Grid item xs={6}>
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

				{this.messageUI()}
			</div>
		);
	}
}

AddComments.propTypes = {
	classes: PropTypes.object
};

export default withStyles(styles)(AddComments);
