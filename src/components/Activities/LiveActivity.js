import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import red from '@material-ui/core/colors/red';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import { Timeline, TimelineEvent } from 'react-event-timeline';

//Icons
import NewMessageIcon from '@material-ui/icons/Message';

// App Classes
import axios from 'axios';
import moment from 'moment';
import CardDiv from '../common/CardDiv';
import AddComments from './AddComments';
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

const styles = (theme) => ({
	timelineCard: {
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		overflow: 'hidden'
	},
	chip: {
		marginLeft: theme.spacing.unit * 20
	},

	icon: {
		color: 'rgba(255, 255, 255, 0.54)'
	},
	messageCard: {
		marginTop: theme.spacing.unit * 5,
		backgroundColor: 'rgba(0, 0, 0, 0.1)'
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
		bottom: theme.spacing.unit * 5,
		right: theme.spacing.unit * 10,
		zIndex: 10
	},
	button: {
		marginTop: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		marginTop: 20
	},
	card: {
		marginTop: theme.spacing.unit,
		marginRight: theme.spacing.unit
	},
	eventBg: {
		backgroundColor: 'rgba(0, 0, 0, 0)'
	},
	media: {
		height: 0,
		paddingTop: '56.25%' // 16:9
	},
	actions: {
		display: 'flex'
	},
	expand: {
		transform: 'rotate(0deg)',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest
		}),
		marginLeft: 'auto',
		[theme.breakpoints.up('sm')]: {
			marginRight: -8
		}
	},
	expandOpen: {
		transform: 'rotate(180deg)'
	},
	avatar: {
		backgroundColor: red[500]
	}
});

class LiveActivity extends Component {
	constructor(props) {
		super(props);
		this.state = {
			settings: this.props.settings,
			emp_id: this.props.emp_id,
			timeline: [],
			value: 0,
			isAddNew: false,
			message_id: '',
			user_id: 1,
			replay: '',
			dynamicTitle: 'Timeline'
		};
	}

	handleChange = (event, value) => {
		this.setState({ value });
	};

	componentWillMount() {
		this.fetchMessages();
	}

	fetchMessages() {
		// let app_id = localStorage.getItem('app_id');
		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		axios
			.post('', {
				action: 'timeline'
			})
			.then((res) => {
				const data = res.data.data;
				const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
					this.setState({ timeline: responseString.data });
				} else {
					console.log('Data Not found');
				}
			});
	}

	addNewMessage() {
		this.setState({ dynamicTitle: 'Status Report', isAddNew: true });
	}

	onTapBack() {
		this.setState({ isAddNew: false });
		this.fetchMessages();
	}

	onEditPartner(partnerId) {
		console.log(`Partner ID ${partnerId}`);
		this.setState({ isEdit: true, owner_id: partnerId });
	}

	cardView(message) {
		const { classes } = this.props;

		return (
			<TimelineEvent
				createdAt={<Chip label={moment(message.date).format('Do MMM h:m:s a')} color="secondary" />}
				contentStyle={{ backgroundColor: 'none', boxShadow: 'none' }}
				bubbleStyle={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0, 0, 0, 0.6)', width: 30, height: 30 }}
			>
				<Card className={classes.card}>
					<CardHeader
						avatar={
							<Avatar aria-label="Recipe" className={classes.avatar}>
								{message.avatar}
							</Avatar>
						}
						title={message.user}
						subheader={moment(message.date).format('Do MMM h:m a')}
					/>
					<CardContent>
						<Typography component="p">{message.content}</Typography>
					</CardContent>
				</Card>
			</TimelineEvent>
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
		const { isAddNew, dynamicTitle, timeline, emp_id, settings } = this.state;

		const{ activity_capture } = settings;

		if (isAddNew) {
			return (
				<CardDiv title={dynamicTitle}>
					<AddComments emp_id={emp_id} onTapBack={this.onTapBack.bind(this)} />
				</CardDiv>
			);
		} else {
			return (
				<div>
					{activity_capture == 1 ? (
					<Button
						variant="extendedFab"
						color="secondary"
						className={classes.btnRightA}
						onClick={this.addNewMessage.bind(this)}
					>
						<NewMessageIcon />
					</Button>) : ('') }
					<div style={{ maxHeight: 550, overflow: 'auto', backgroundColor: 'none' }}>
						<Timeline lineColor="#FFFFFF">{timeline.map((message) => this.cardView(message))}</Timeline>
					</div>
				</div>
			);
		}
	}
}

LiveActivity.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LiveActivity);
