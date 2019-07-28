import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Icons
import BounsIcon from '@material-ui/icons/CardGiftcard';
import AccnouncementIcon from '@material-ui/icons/Announcement';
import AppSettingsIcon from '@material-ui/icons/SettingsApplications';
import AppConfig from './AppConfiguration';
import AddBonus from '@material-ui/icons/AddAlarm';
import AddAnnoucementIcon from '@material-ui/icons/AddAlert';

// App Classes
import BonusTable from './BonusTable';
import axios from 'axios';
import CardDiv from '../common/CardDiv';
import AnnouncementTable from './AnnouncementTable';
import AddAnnoucement from './AddAnnoucement';
import AddBonusCategory from './AddBonusCategory';
import { baseURL } from '../AppConst';
import Alert from '../common/Alert';


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
	root: {
		flexGrow: 1,
		width: '100%'
	},
	bar: {
		backgroundColor: '#1a237e'
	},
	rightIcon: {
		marginLeft: theme.spacing.unit
	},
	btnRightA: {
		position: 'absolute',
		top: theme.spacing.unit * 20,
		right: theme.spacing.unit * 10
	},

	btnBottom: {
		right: theme.spacing.unit * 10
	}
});

class ControlPanel extends Component {
	handleChange = (name) => (event) => {
		this.setState({ [name]: event.target.checked });
	};

	constructor(props) {
		super(props);
		this.state = {
			bonus: [],
			announcements: [],
			value: 0,
			bonus_id: '',
			isAddBonus: false,
			isAddAnoucement: false,
			emp_id: this.props.emp_id,
			data_approved: [],
			data_verify: []
		};
	}

	handleChange = (event, value) => {
		if (value > 0) {
			if (this.state.announcements.length < 1) {
				this.fetchAnnouncement();
			}
		}

		this.setState({ value });
	};

	componentWillMount() {
		
		this.fetchBonus();
	}

	fetchBonus = () => {
		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');

		axios
			.post('', {
				action: 'bonus-category',
				user_id: ''
			})
			.then((res) => {
				const data = res.data.data;
				const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
					this.setState({ bonus: responseString.data });
				} else {
					console.log('Data Not found');
				}
			});
	};

	fetchAnnouncement = () => {
		
		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');

		axios
			.post('', {
				action: 'announcements',
				user_id: ''
			})
			.then((res) => {
				const data = res.data.data;
				const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
					this.setState({ announcements: responseString.data });
				} else {
					console.log('Data Not found');
				}
			});
	};

	onTapAddBonusCategory() {
		this.setState({ isAddBonus: true });
	}

	onTapAddAnnouncement() {
		this.setState({ isAddAnoucement: true });
	}

	onTapBack() {
		
		this.setState({ isAddBonus: false, isAddAnoucement: false });

		if (this.state.value > 0) {
			this.fetchAnnouncement();
		} else {
			this.fetchBonus();
		}
	}

	onDeleteBonus(bonus_id) {
		this.setState({
			bonus_id: bonus_id,
			deleteBonus: true,
			showAlert: true,
			msg: 'Are you sure to delete the selected Bonus?',
			title: 'Delete Confirmation!'
		});
	}

	onDeleteAnnouncement(announcement_id) {
		this.setState({
			announcement_id: announcement_id,
			deleteAnnouncement: true,
			showAlert: true,
			msg: 'Are you sure to delete the selected Announcement?',
			title: 'Delete Confirmation!'
		});
	}

	render() {


		const { classes } = this.props;

		const { value, isAddBonus, isAddAnoucement, emp_id, showAlert, title, msg } = this.state;

		if (isAddBonus) {
			return (
				<CardDiv title={'Add Bonus Target'}>
					<AddBonusCategory emp_id={emp_id} onTapBack={this.onTapBack.bind(this)} />
				</CardDiv>
			);
		} else if (isAddAnoucement) {
			return (
				<CardDiv title={'Add Annoucement'}>
					<AddAnnoucement emp_id={emp_id} onTapBack={this.onTapBack.bind(this)} />
				</CardDiv>
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
				<CardDiv title={'Control Panel'}>
					<Tabs
						value={value}
						onChange={this.handleChange}
						scrollable
						scrollButtons="on"
						indicatorColor="secondary"
						textColor="secondary"
					>
						<Tab label="Bonus" icon={<BounsIcon />} />
						<Tab label="Announcement" icon={<AccnouncementIcon />} />
						<Tab label="App settings" icon={<AppSettingsIcon />} />
					</Tabs>

					{value === 0 && (
						<TabContainer>
							<Button
								variant="extendedFab"
								color="secondary"
								className={classes.btnRightA}
								onClick={this.onTapAddBonusCategory.bind(this)}
							>
								Add Bonus <AddBonus className={classes.rightIcon} />
							</Button>
							<BonusTable onDelete={this.onDeleteBonus.bind(this)} data={this.state.bonus} />
						</TabContainer>
					)}
					{value === 1 && (
						<TabContainer>
							<Button
								variant="extendedFab"
								color="secondary"
								className={classes.btnRightA}
								onClick={this.onTapAddAnnouncement.bind(this)}
							>
								New Announcement <AddAnnoucementIcon className={classes.rightIcon} />
							</Button>
							<AnnouncementTable
								onDelete={this.onDeleteAnnouncement.bind(this)}
								data={this.state.announcements}
							/>
						</TabContainer>
					)}
					{value === 2 && (
						<TabContainer>
							<AppConfig />
						</TabContainer>
					)}
				</CardDiv>
				</div>
			);
		}
	}

	///////////////////// UTILITY /////////////

	//ALERT
	onDismiss = () => {
		this.setState({ showAlert: false, deleteBonus: false });
	};

	onOkay = () => {
		this.setState({ showAlert: false });
		if(this.state.deleteBonus){
			this.onExecuteBonusDeleteCommand();
		}else if(this.state.deleteAnnouncement){
			this.onExecuteAnnoucementDeleteCommand();
		}
	};

	onExecuteAnnoucementDeleteCommand() {
		const { announcement_id } = this.state;
		this.setState({deleteAnnouncement: false});

		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		axios
			.post('', {
				action: 'remove-announcement',
				id: announcement_id
			})
			.then((res) => {
				const status = parseInt(res.data.status);
				if (status === 200) {
					this.fetchAnnouncement();
				}
			});
	}


	onExecuteBonusDeleteCommand() {
		const { bonus_id } = this.state;
		this.setState({deleteBonus: false});

		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		axios
			.post('', {
				action: 'remove-bonus',
				id: bonus_id
			})
			.then((res) => {
				const status = parseInt(res.data.status);
				if (status === 200) {
					this.fetchBonus();
				}
			});
	}



}

ControlPanel.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ControlPanel);
