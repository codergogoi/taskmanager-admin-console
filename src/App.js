import React, { Component } from 'react';
//Common UI
import './App.css';


//App Classes & Network Calls
import axios from 'axios';
import Alert from './components/common/Alert';
import { baseURL } from './components/AppConst';
import Login from './components/Users/Login';
import Dashboard from './components/DashBoard';


class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLogin: false,
			appSecret: '',
			currentUser: []
		};
		this.checkLogin = this.checkLogin.bind(this);
		this.didLogout = this.didLogout.bind(this);
	}

	componentWillMount() {
		this.checkAuthorization();
	}

	checkAuthorization = () => {
		
		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');

		this.setState({ currentUser: JSON.parse(localStorage.getItem('current_user')) });

		axios
			.post('', {
				action: ''
			})
			.then((res) => {
				const data = res.data.data;
				const status = parseInt(res.data.status);
				if (status === 200) {
					this.setState({ isLogin: true });
				}
			});
	};

	checkLogin(props) {
		axios.defaults.baseURL = baseURL;
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('app_token');
		axios
			.post('', {
				action: 'login',
				email: props.email,
				password: props.password
			})
			.then((res) => {
				const data = res.data.data;
				const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
					let user = responseString.data;
					localStorage.setItem('app_token', user.token);
					localStorage.setItem('current_user', JSON.stringify(user));
					// console.log(
					// 	'App Token :' +
					// 		localStorage.getItem('app_token') +
					// 		' User:' +
					// 		JSON.stringify(localStorage.getItem('current_user'))
					// );
					this.setState({ isLogin: true, currentUser: user });
				} else {
					this.setState({
						showAlert: true,
						msg: 'User ID Password does not match!',
						title: 'Login Error!'
					});
				}
			});
	}

	didLogout() {
		localStorage.setItem('app_token', null);
		this.setState({ isLogin: false });
	}

	render() {
		const { showAlert, title, msg, isLogin, currentUser } = this.state;

		if (isLogin) {
			return (
					<Dashboard onLogout={this.didLogout} currentUser={currentUser} />
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
					<Login onCheckLogin={this.checkLogin} />
				</div>
			);
		}
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

export default App;
