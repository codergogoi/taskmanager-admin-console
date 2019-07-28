import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';

const styles = (theme) => ({
	card: {
		flex: 1,
		backgroundColor: 'none'
	},
	title: {
		marginBottom: 16,
		fontSize: 14
	},
	media: {
		height: 0,
		paddingTop: '2%' // 16:9
	},
	actions: {
		display: 'flex'
	},
	expand: {
		transform: 'rotate(0deg)',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest
		}),
		marginLeft: 'auto'
	},
	expandOpen: {
		transform: 'rotate(180deg)'
	},
	avatar: {
		backgroundColor: red[500]
	}
});

class CardDiv extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			title: props.title,
			isAdd: props.isAdd,
			isBack: props.isBack
		};

		this.addButton = this.addButton.bind(this);
	}

	addButton() {}

	render() {
		const { classes } = this.props;

		return (
			<div>
				<Card className={classes.card}>
					<CardHeader action={this.addButton()} title={this.state.title} />
					<CardContent>
						<Typography component="p">{this.props.children}</Typography>
					</CardContent>
				</Card>
			</div>
		);
	}
}

CardDiv.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CardDiv);
