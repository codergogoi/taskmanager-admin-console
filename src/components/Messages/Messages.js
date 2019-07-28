import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CardContent } from '@material-ui/core';
import moment from 'moment';


//Common Icons
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import SendIcon from '@material-ui/icons/ReplyAll';


// App Classes
import axios from 'axios';
import CardDiv from '../common/CardDiv';
import AddMessage from './AddMessage';
import Alert from '../common/Alert';
import { baseURL } from '../AppConst';

function TabContainer(props) {
	return (
		<Typography component="div" style={{ padding: 8 * 3 }}>
			{props.children}
		</Typography>
	);
}

TabContainer.propTypes = {
	children: PropTypes.node.isRequired
};


// CSS Module
const styles = (theme) => ({
	root: {
		flexGrow: 1,
		width: '100%'
	},
	messageCard: {
		marginTop: theme.spacing.unit * 5
	},
	heading: {
		fontSize: 16,
		fontWeight: 'bold',
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit
	},
	bar: {
		backgroundColor: '#1a237e'
	},
	rightIcon: {
		marginLeft: theme.spacing.unit
	},
	optionsText: {
		fontSize: 16,
		fontWeight: 'bold',
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		marginTop: 10
	},
	remarksTextField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: 650
	},
	replay: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		color: '#66164e'
	},
	detailsText: {
		fontSize: 16,
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		marginTop: 10
	},
	btnRightA: {
		position: 'absolute',
		top: theme.spacing.unit * 20,
		right: theme.spacing.unit * 10
	},
	button: {
		marginTop: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		marginTop: 20
	}
});

class Messages extends Component {
	constructor(props) {
		super(props);
		this.state = {
			settings: this.props.settings,
			messages: [],
			value: 0,
			isAddNew: false,
			message_id: '',
			emp_id: this.props.emp_id,
			replay: '',
			data_approved: [],
			data_verify: [],
			dynamicTitle: 'Messages [Inbox]'
		};
	}

	handleChange = (event, value) => {
		this.setState({ value });
	};

	componentWillMount() {
		this.fetchMessages();
	}

	fetchMessages() {
		const { emp_id } = this.state;

		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		axios
			.post('', {
				action: 'inbox',
				user_id: emp_id
			})
			.then((res) => {
				const data = res.data.data;
				const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
					this.setState({ messages: responseString.data });
				}
			});
	}

	addNewMessage() {
		this.setState({ dynamicTitle: 'Compose New Message', isAddNew: true });
	}

	onTapBack() {
		this.setState({ isAddNew: false });
		this.fetchMessages();
	}

	onEditPartner(partnerId) {
		console.log(`Partner ID ${partnerId}`);
		this.setState({ isEdit: true, owner_id: partnerId });
	}

	handleCollapse = (panel, n) => (event, expanded) => {
		this.setState({
			message_id: n.id,
			subject: n.subject,
			recipient: n.recipient,
			replay: '',
			expanded: expanded ? panel : false
		});
	};

	handleReplayMessage = (e) => {
		this.setState({
			replay: e.target.value
		});
	};

	onTapReplayMessage = () => {
		const { message_id, replay, emp_id, subject, recipient } = this.state;
		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		axios
			.post('', {
				action: 'replay-message',
				id: message_id,
				user_id: emp_id,
				content: replay,
				subject: subject,
				recipient: recipient
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

	messagesCollapseView() {
		const { classes } = this.props;
		const { expanded, messages, replay } = this.state;

		return (
			<div>
				{messages.map((n) => {
					return (
						<ExpansionPanel expanded={expanded === n.id} onChange={this.handleCollapse(n.id, n)}>
							<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
								<Typography className={classes.heading}>
									{n.subject + ' : From - ' + n.sender}
								</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<Grid container spacing={24}>
									<Grid item xs={9}>
										<FormControl>
											<Typography paragraph>
												{'[' + moment(n.date).format('Do MMM YYYY') + '] ' + n.content}
											</Typography>

											{n.replay.length > 0 ? (
												<Typography className={classes.replay}>
													{' You wrote: [' +
														moment(n.replay_date).format('Do MMM YYYY') +
														'] >> ' +
														n.replay}
												</Typography>
											) : (
												''
											)}

											{n.replay === '' ? (
												<div>
													<TextField
														id="replay"
														label="Replay"
														multiline
														rowsMax="10"
														onChange={this.handleReplayMessage.bind(this)}
														className={classes.remarksTextField}
														value={replay}
														margin="normal"
														variant="outlined"
													/>

													<div>
														<Button
															variant="extendedFab"
															color="secondary"
															className={classes.button}
															onClick={this.onTapReplayMessage.bind(this)}
														>
															Replay <SendIcon className={classes.rightIcon} />
														</Button>
													</div>
												</div>
											) : (
												''
											)}
										</FormControl>
									</Grid>
								</Grid>
							</ExpansionPanelDetails>
						</ExpansionPanel>
					);
				})}
			</div>
		);
	}

	//ALERT
	onDismiss = () => {
		this.setState({ showAlert: false });
	};

	onOkay = () => {
		this.setState({ showAlert: false });
		if (this.state.isDone) {
			this.fetchMessages();
		}
	};

	render() {
		const { classes } = this.props;
		const { value, isAddNew, dynamicTitle,showAlert, title, msg,settings  } = this.state;

		const { send_message,email_notification } = settings;

		if (isAddNew) {
			return (
				<CardDiv title={dynamicTitle}>
					<AddMessage email_notification={email_notification} onTapBack={this.onTapBack.bind(this)} />
				</CardDiv>
			);
		} else {
			return (
				<CardDiv title={dynamicTitle}>
					<Alert
						open={showAlert}
						onCancel={this.onOkay.bind(this)}
						onOkay={this.onOkay.bind(this)}
						title={title}
						msg={msg}
					/>

					{send_message == 1 ? (
						<Button
							variant="extendedFab"
							color="secondary"
							className={classes.btnRightA}
							onClick={this.addNewMessage.bind(this)}
						>
							Compose <EditIcon className={classes.rightIcon} />
						</Button>
						) : ('')}
					<CardContent className={classes.messageCard}>{this.messagesCollapseView()}</CardContent>
				</CardDiv>
			);
		}
	}
}

Messages.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Messages);
