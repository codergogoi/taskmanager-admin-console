import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PendingTaskIcon from '@material-ui/icons/AssignmentReturned';
import ComletedTaskIcon from '@material-ui/icons/AssignmentTurnedIn';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

// Icons
import DownloadIcon from '@material-ui/icons/CloudDownload';

// App Classes
import axios from 'axios';
import CardDiv from '../common/CardDiv';
import BonusReportTable from './BonusReportTable';
import ProgressReportTable from './ProgressReportTable';
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


// CSS
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
	selectionField: {
		marginTop: theme.spacing.unit,
		marginRight: theme.spacing.unit
	}
});

class ProgressReport extends Component {
	constructor(props) {
		super(props);
		this.state = {
			settings: this.props.settings,
			progressReport: [],
			bonusReport: [],
			value: 0,
			isExport: false,
			emp_id: this.props.emp_id,
			user_type: this.props.user_type,
			data_approved: [],
			data_verify: [],
			start_date: '00/00/00',
			end_date: '00/00/00'
		};
	}

	handleChange = (event, value) => {
		if (value > 0) {
			if (this.state.bonusReport.length < 1) {
				this.fetchBonusReport();
			}
		}
		this.setState({ value });
	};

	componentWillMount() {
		this.fetchProgressReport();
	}

	fetchProgressReport = () => {
		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');

		const { emp_id } = this.state;
		axios
			.post('', {
				action: 'task-progress',
				user_id: emp_id
			})
			.then((res) => {
				const data = res.data.data;
				const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
					this.setState({ progressReport: responseString.data });
				} else {
					console.log('Data Not found');
				}
			});
	};

	fetchBonusReport = () => {
		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');

		const { emp_id } = this.state;
		axios
			.post('', {
				action: 'bonus-report',
				user_id: emp_id
			})
			.then((res) => {
				const data = res.data.data;
				const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
					this.setState({ bonusReport: responseString.data });
				} else {
					console.log('Data Not found');
				}
			});
	};

	onTapExport() {
		this.setState({ isExport: true });
	}

	onTapDownload() {
		
		const { start_date, end_date, emp_id, user_type } = this.state;
		
		if (start_date == '00/00/00') {
			this.setState({
				showAlert: true,
				msg: 'Please Select Start Date',
				title: 'Start Date is Empty!'
			});
			return;
		}

		if (end_date == '00/00/00') {
			this.setState({
				showAlert: true,
				msg: 'Please Select End Date',
				title: 'End Date is Empty!'
			});
			return;
		}

		this.setState({ isExport: false });
		
		const reportUrl = baseURL + 'export_report.php?mode=0&emp_id=' + emp_id + '&s_date=' + start_date + '&e_date=' + end_date;
		const teamReportUrl = baseURL + 'export_report.php?mode=0&emp_id=ALL' + '&s_date=' + start_date + '&e_date=' + end_date;
		if (user_type === 'Admin') {
			window.open(teamReportUrl, '_self');
		} else {
			window.open(reportUrl, '_self'); //to open new page
		}
	}

	onTapBack() {
		this.setState({ isExport: false });
	}

	viewReport(emp_id) {
		const reportUrl = baseURL + 'export_report.php?mode=0&emp_id=' + emp_id;
		window.open(reportUrl, '_self'); //to open new page
	}

	handleTextChanges = (event) => {
		if (event.target.id == 'start-date') {
			this.setState({ start_date: event.target.value });
		} else if (event.target.id == 'end-date') {
			this.setState({ end_date: event.target.value });
		}
	};

	render() {
		const { classes } = this.props;
		const { value, isExport, start_date, end_date,showAlert, title, msg, settings } = this.state;

		const { download_report } = settings;

		return (
			<div>
				<Alert
					open={showAlert}
					onCancel={this.onOkay.bind(this)}
					onOkay={this.onOkay.bind(this)}
					title={title}
					msg={msg}
				/>
			<CardDiv title={'Progress Report'}>
				<Tabs
					value={value}
					onChange={this.handleChange}
					scrollable
					scrollButtons="on"
					indicatorColor="secondary"
					textColor="secondary"
				>
					<Tab label="Progress Report" icon={<PendingTaskIcon />} />
					<Tab label="Bonus Report" icon={<ComletedTaskIcon />} />
				</Tabs>

				{value === 0 && (
					<TabContainer>
						{isExport == false && download_report == 1 ? (
							<Button
								variant="extendedFab"
								color="secondary"
								className={classes.btnRightA}
								onClick={this.onTapExport.bind(this)}
							>
								Export Report
							</Button>
						) : (
							''
						)}
						{isExport == true && download_report == 1 ? (
							<div className={classes.btnRightA}>
								<TextField
									id="start-date"
									label="Date From"
									className={classes.selectionField}
									type="date"
									margin="normal"
									onChange={this.handleTextChanges.bind(this)}
									value={start_date}
								/>
								<TextField
									id="end-date"
									label="Date To"
									className={classes.selectionField}
									type="date"
									margin="normal"
									onChange={this.handleTextChanges.bind(this)}
									value={end_date}
								/>
								<Button variant="extendedFab" color="secondary" onClick={this.onTapDownload.bind(this)}>
									<DownloadIcon />
								</Button>
							</div>
						) : (
							''
						)}

						<ProgressReportTable
							isDownload = {download_report}
							onEdit={this.viewReport.bind(this)}
							isEdit={true}
							data={this.state.progressReport}
						/>
					</TabContainer>
				)}
				{value === 1 && (
					<TabContainer>
						<BonusReportTable data={this.state.bonusReport} />
					</TabContainer>
				)}
			</CardDiv>
			</div>
		);
	}

	// Utility Functions 
	onDismiss = () => {
		this.setState({ showAlert: false });
	};

	onOkay = () => {
		this.setState({ showAlert: false });
	};


}

ProgressReport.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProgressReport);
