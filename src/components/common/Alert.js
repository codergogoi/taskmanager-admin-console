import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class Alert extends React.Component {
	render() {
		return (
			<div>
				<Dialog
					open={this.props.open}
					onClose={this.props.onDismiss}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">{this.props.msg}</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.props.onCancel} color="primary">
							Cancel
						</Button>
						<Button onClick={this.props.onOkay} color="primary" autoFocus>
							Ok
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

export default Alert;
