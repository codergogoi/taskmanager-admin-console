import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

// Icons
import BackIcon from '@material-ui/icons/ArrowBack';
import SendIcon from '@material-ui/icons/Send';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';

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

class AddMessage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email_notification: this.props.email_notification,
			recipients: [],
			sender: 1,
			subject: '',
			content: '',
			open: false,
			checked: [],
			isExpand: false
		};
	}

	componentWillMount() {
		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		axios
			.post('', {
				action: 'view-users',
				user_id: ''
			})
			.then((res) => {
				const data = res.data.data;
				const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
					this.setState({ recipients: responseString.data });

					console.log(JSON.stringify(this.state.receipients));
				} else {
					console.log('Data Not found');
				}
			});
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
		const { sender, checked, subject, content,email_notification } = this.state;

		if (subject.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please enter message subject!',
				title: 'Missing Message Subject!'
			});
			return;
		}

		if (checked.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please select at least one recipient!',
				title: 'Missing Recipient!'
			});
			return;
		}

		if (content.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please enter message Content!',
				title: 'Missing Message Content!'
			});
			return;
		}

		

		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		axios
			.post('', {
				action: 'send-message',
				sender: sender,
				recipients: checked,
				subject: subject,
				content: content,
				email: email_notification,
			})
			.then((res) => {
				const responseString = JSON.parse(JSON.stringify(res.data));

				if (responseString.status === 200) {
					this.setState({
						showAlert: true,
						isDone: true,
						msg: 'Message Sent Successfully!',
						title: 'Message Sent'
					});
				} else {
					this.setState({
						showAlert: true,
						msg: 'Opps something went wrong with Sending Message!',
						title: 'Message sent'
					});
				}
			});
	};

	handleTextChanges = (event) => {
		if (event.target.id == 'subject') {
			this.setState({ subject: event.target.value });
		} else if (event.target.id == 'content') {
			this.setState({ content: event.target.value });
		}
	};

	handleClick = () => {
		this.setState((state) => ({ open: !state.open }));
		this.setState((state) => ({ isExpand: !state.isExpand }));
	};

	handleSelectFinish = () => {
		this.setState({ open: false });
		this.setState({ isExpand: false });
	};

	handleToggle = (value) => () => {
		const { checked } = this.state;
		const currentIndex = checked.indexOf(value);
		const newChecked = [ ...checked ];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		this.setState({
			checked: newChecked
		});
	};

	viewRecipients() {
		const { recipients } = this.state;

		return (
			<List>
				{recipients.map((n) => {
					return (
						<ListItem key={n.id} role={undefined} dense button onClick={this.handleToggle(n.id)}>
							<Checkbox checked={this.state.checked.indexOf(n.id) !== -1} tabIndex={-1} disableRipple />
							<ListItemText primary={n.email} />
						</ListItem>
					);
				})}
			</List>
		);
	}

	messageUI = () => {
		const { classes } = this.props;
		const { subject, content} = this.state;

		return (
			<Grid container spacing={24}>
				<Grid item xs={6}>
					<FormControl>
						<TextField
							id="subject"
							label="Subject"
							className={classes.textField}
							type="text"
							required="true"
							autoComplete="Message Subject"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={subject}
						/>

						<ListItem>
							<Button
								variant="fab"
								color="secondary"
								aria-label="Add"
								className={classes.addButton}
								onClick={this.handleClick.bind(this)}
							>
								{this.state.isExpand ? <DoneIcon /> : <AddIcon />}
							</Button>
							{this.state.open ? this.viewRecipients() : 'Recipients [' + this.state.checked.length + ']'}
						</ListItem>

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
							onClick={this.handleSelectFinish.bind(this)}
							value={content}
						/>

						<Button
							variant="extendedFab"
							color="secondary"
							className={classes.button}
							onClick={this.onTapSendMessage.bind(this)}
						>
							Send <SendIcon className={classes.rightIcon} />
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

AddMessage.propTypes = {
	classes: PropTypes.object
};

export default withStyles(styles)(AddMessage);
