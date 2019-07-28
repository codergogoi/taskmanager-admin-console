import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Grid, CardHeader, Card, CardContent, Typography, Avatar } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

//Icons
import EditPhoto from '@material-ui/icons/AddAPhoto';
import UpploadIcon from '@material-ui/icons/FileUpload';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';


//App Classes
import Alert from '../common/Alert';
import axios from 'axios';
import { baseURL } from '../AppConst';


//Style Sheet
const styles = (theme) => ({
	container: {
		flex: 1,
		display: 'flex',
		flexWrap: 'wrap',
		flexDirection: 'row'
	},
	card: {
		height: 600
	},
	formControl: {
		margin: theme.spacing.unit
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: 300
	},
	button: {
		margin: theme.spacing.unit
	},
	buttonSaveChanges: {
		margin: theme.spacing.unit,
		marginLeft: theme.spacing.unit * 10
	},
	leftIcon: {
		marginRight: theme.spacing.unit
	},
	rightIcon: {
		marginLeft: theme.spacing.unit
	},
	iconSmall: {
		fontSize: 20
	},
	avatar: {
		margin: 0,
		width: 200,
		height: 200
	},
	btnRightA: {
		position: 'absolute',
		marginTop: 50,
		bottom: theme.spacing.unit * 10,
		left: theme.spacing.unit * 20
	}
});

//Main Class
class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			emp_id: this.props.emp_id,
			first_name: '',
			last_name: '',
			email: '',
			phone: '',
			open: false,
			current_msg: '',
			address: '',
			designation: '',
			profile_pic: '',
			selectedFile: null,
			previewImage: ''
		};

		this.fetchUserProfile.bind(this);
	}

	componentWillMount() {
	
		this.fetchUserProfile();
	}

	//Fetch Task Details
	fetchUserProfile = () => {

		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		const { emp_id } = this.state;
		axios
			.post('', {
				action: 'view-users',
				user_id: emp_id
			})
			.then((res) => {
				const data = res.data.data;
				const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
					let user = responseString.data[0];
					this.setState({
						user_id: user.id,
						first_name: user.first_name,
						last_name: user.last_name,
						designation: user.designation,
						address: user.address,
						phone: user.phone,
						email: user.email,
						previewImage: baseURL+user.profile_pic
					});

				}
			});

	};

	// onDismiss = () => {
	// 	this.setState({ open: false });
	// };

	onTapSave = () => {

		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');

		const { user_id, first_name, last_name, address, phone } = this.state;

		if (first_name.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please enter your First Name!',
				title: 'First Name is required!'
			});
			return;
		}

		if (last_name.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please enter your Last Name!',
				title: 'Last Name is required!'
			});
			return;
		}

		if (phone.length < 9) {
			this.setState({
				showAlert: true,
				msg: 'Please Provide a valid Phone Number!',
				title: 'Phone Number isrequired!'
			});
			return;
		}

		if (address.length < 1) {
			this.setState({
				showAlert: true,
				msg: 'Please enter your Address!',
				title: 'Address is required!'
			});
			return;
		}

		axios
			.post('', {
				action: 'edit-user',
				user_id: user_id,
				first_name: first_name,
				last_name: last_name,
				phone_no: phone,
				address: address
			})
			.then((res) => {
				const response = JSON.parse(JSON.stringify(res.data));
				if (response.status === 200) {
					this.setState({
						showAlert: true,
						msg: 'Profile Updated Successfully!',
						title: 'Update Profile'
					});
				} 
			});
	};

	handleTextChanges = (e) => {
		if (e.target.id == 'first-name') {
			this.setState({
				first_name: e.target.value
			});
		} else if (e.target.id == 'last-name') {
			this.setState({
				last_name: e.target.value
			});
		} else if (e.target.id == 'address') {
			this.setState({
				address: e.target.value
			});
		} else if (e.target.id == 'phone-no') {
			this.setState({
				phone: e.target.value
			});
		}
	};

	fileChangedHandler = (event) => {
		if (event.target.files.length > 0) {
			this.setState({
				selectedFile: event.target.files[0],
				previewImage: URL.createObjectURL(event.target.files[0])
			});
		}
	};

	uploadPic = () => {
		this.refs.profilePicUpload.click();
	};

	sendFile = () => {

		const { emp_id} = this.state;

		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		const data = new FormData();
		data.append('file', this.state.selectedFile, this.state.selectedFile.name);
		const config = {
			headers: {
				'content-type': 'multipart/form-data'
			}
		}
		axios.post('upload.php?emp_id='+ emp_id, data,config).then((res) => {
			const response = JSON.parse(JSON.stringify(res.data));
			if (response.status === 200) {
				this.setState({
					showAlert: true,
					msg: 'Profile Picture Updated Successfully!',
					title: 'Update Profile Picture'
				});
			} else {
				this.setState({
					showAlert: true,
					msg: 'Failed to Update Profile Picture!',
					title: 'Update Profile Picture'
				});
			}
		});
	};

	profileUI = () => {
		const { classes } = this.props;

		const { first_name, last_name, address, email, phone, designation, previewImage, selectedFile } = this.state;

		return (
			<Grid container spacing={24}>
				<Grid item xs={6}>
					<FormControl>
						<TextField
							id="first-name"
							label="First Name"
							className={classes.textField}
							type="text"
							autoComplete="First Name"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={first_name}
						/>
						<TextField
							id="last-name"
							label="Last Name"
							className={classes.textField}
							type="text"
							autoComplete="Last Name"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={last_name}
						/>
						<TextField
							id="email-id"
							label="Email ID"
							className={classes.textField}
							type="email"
							disabled="true"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={email}
						/>
						<TextField
							id="phone-no"
							label="Phone Number"
							className={classes.textField}
							type="phone"
							autoComplete="none"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={phone}
						/>
						<TextField
							id="address"
							label="Address"
							multiline="true"
							className={classes.textField}
							type="text"
							rows="4"
							autoComplete="Address"
							margin="normal"
							onChange={this.handleTextChanges.bind(this)}
							value={address}
						/>
					</FormControl>
				</Grid>
				<Grid item xs={6}>
					<Button
						onClick={this.uploadPic.bind(this)}
						variant="fab"
						color="secondary"
						aria-label="add"
						className={classes.button}
					>
						<EditPhoto />
					</Button>
					<FormControl>
						<Avatar alt="no Pic" src={previewImage} className={classNames(classes.avatar)} />
						<input
							type="file"
							ref="profilePicUpload"
							onChange={this.fileChangedHandler}
							style={{ display: 'none' }}
						/>
						<TextField
							id="designation"
							label="Designation"
							className={classes.textField}
							type="text"
							margin="normal"
							disabled="true"
							value={designation}
						/>
						{selectedFile != null ? (
							<Button
								onClick={this.sendFile.bind(this)}
								variant="fab"
								color="secondary"
								aria-label="add"
								className={classes.button}
							>
								<UpploadIcon />
							</Button>
						) : (
							''
						)}
					</FormControl>
				</Grid>
			</Grid>
		);
	};

	render() {
		const { classes } = this.props;
		const { showAlert, title, msg } = this.state;

		return (
			<div>
				<Alert
					open={showAlert}
					onCancel={this.onOkay.bind(this)}
					onOkay={this.onOkay.bind(this)}
					title={title}
					msg={msg}
				/>

				<Card className={classes.card}>
					<CardHeader title={this.state.title} />
					<CardContent>
						<Typography component="p">{this.profileUI()}</Typography>
					</CardContent>
					<Button
						variant="extendedFab"
						color="secondary"
						className={classes.buttonSaveChanges}
						onClick={this.onTapSave.bind(this)}
					>
						Save Changes <SaveIcon className={classes.rightIcon} />
					</Button>
				</Card>
			</div>
		);
	}

	//========================= UTILITY ===============================

	//ALERT
	onDismiss = () => {
		this.setState({ showAlert: false });
	};

	onOkay = () => {
		this.setState({ showAlert: false });
	};
}

Profile.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Profile);
