import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

//Icons
import SaveIcon from '@material-ui/icons/Save';


// App Classes
import classes from 'classnames';
import axios from 'axios';
import Alert from '../common/Alert';
import { baseURL } from '../AppConst';

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

	btnBottom: {
		position: 'absolute',
		right: theme.spacing.unit * 20
	}
});

class AppConfiguration extends React.Component {
	state = {
		send_message: false,
		download_report: false,
		email_notification: false,
		apply_leaves: false,
		activity_capture: false
	};

	componentWillMount() {
		this.fetchSettings();
	}

	fetchSettings() {
		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		axios
			.post('', {
				action: 'fetch-settings'
			})
			.then((res) => {
				const data = res.data.data;
				const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
					const settings = responseString.data[0];

					this.setState({
						send_message: Boolean(Number(settings.send_message)),
						download_report: Boolean(Number(settings.download_report)),
						email_notification: Boolean(Number(settings.email_notification)),
						apply_leaves: Boolean(Number(settings.apply_leaves)),
						activity_capture: Boolean(Number(settings.activity_capture))
					});
				}
			});
	}

	handleChange = (name) => (event) => {
		this.setState({ [name]: event.target.checked });
	};

	onTapSaveChanges = () => {
		const { send_message, download_report, email_notification, apply_leaves, activity_capture } = this.state;

		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		axios
			.post('', {
				action: 'save-settings',
				send_message: send_message,
				download_report: download_report,
				email_notification: email_notification,
				apply_leaves: apply_leaves,
				activity_capture: activity_capture
			})
			.then((res) => {
				const responseString = JSON.parse(JSON.stringify(res.data));

				if (responseString.status === 200) {
					this.setState({
						showAlert: true,
						isDone: true,
						msg: 'Successfully Saved Application Settings!',
						title: 'App settings'
					});
					this.fetchSettings();
				} else {
					this.setState({
						showAlert: true,
						msg: 'Opps something went wrong!',
						title: 'App settings'
					});
				}
			});
	};

	render() {
		const {
			send_message,
			download_report,
			email_notification,
			apply_leaves,
			activity_capture,
			showAlert,
			title,
			msg
		} = this.state;

		console.log(JSON.stringify(this.state));

		return (
			<div>
				<Alert
					open={showAlert}
					onCancel={this.onOkay.bind(this)}
					onOkay={this.onOkay.bind(this)}
					title={title}
					msg={msg}
				/>
				<Grid container spacing={24}>
					<Grid item xs={6}>
						<FormControl component="fieldset">
							<FormGroup>
								<FormControlLabel
									control={
										<Switch
											checked={send_message}
											onChange={this.handleChange('send_message')}
											value={true}
										/>
									}
									label="Send Message"
								/>
								<FormControlLabel
									control={
										<Switch
											checked={email_notification}
											onChange={this.handleChange('email_notification')}
											value={true}
										/>
									}
									label="Email Notification"
								/>
								<FormControlLabel
									control={
										<Switch
											checked={download_report}
											onChange={this.handleChange('download_report')}
											value={true}
										/>
									}
									label="Download Report"
								/>
							</FormGroup>
						</FormControl>
					</Grid>
					<Grid item xs={6}>
						<FormControl component="fieldset">
							<FormGroup>
								<FormControlLabel
									control={
										<Switch
											checked={apply_leaves}
											onChange={this.handleChange('apply_leaves')}
											value={true}
										/>
									}
									label="Apply Leaves"
								/>
								<FormControlLabel
									control={
										<Switch
											checked={activity_capture}
											onChange={this.handleChange('activity_capture')}
											value={true}
										/>
									}
									label="Live Activity"
								/>
							</FormGroup>
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<Button
							variant="extendedFab"
							color="secondary"
							className={classes.btnBottom}
							onClick={this.onTapSaveChanges.bind(this)}
						>
							Save Changes <SaveIcon className={classes.rightIcon} />
						</Button>
					</Grid>
				</Grid>
			</div>
		);
	}

	//ALERT
	onDismiss = () => {
		this.setState({ showAlert: false });
	};

	onOkay = () => {
		this.setState({ showAlert: false });
	};
}

export default AppConfiguration;
