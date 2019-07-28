import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import moment from 'moment';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';


function getSorting(order, orderBy) {
	return order === 'desc'
		? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
		: (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

const columnData = [
	{ id: 'title', numeric: false, disablePadding: false, label: 'Title' },
	{ id: 'assign_to', numeric: false, disablePadding: false, label: 'Assigned to' },
	{ id: 'date', numeric: false, disablePadding: false, label: 'Created' },
	{ id: 'deadline', numeric: false, disablePadding: false, label: 'Deadline' },
	{ id: 'status', numeric: false, disablePadding: false, label: 'Status' },
	{ id: 'priority', numeric: false, disablePadding: false, label: 'Priority' },
	{ id: 'type', numeric: false, disablePadding: false, label: 'Task Type' },
	{ id: 'more', numeric: false, disablePadding: false, label: 'Action' }
];

class TaskTableHeader extends React.Component {
	createSortHandler = (property) => (event) => {
		this.props.onRequestSort(event, property);
	};

	render() {
		const { order, orderBy } = this.props;

		return (
			<TableHead>
				<TableRow>
					
					{columnData.map((column) => {
						return (
							<TableCell
								key={column.id}
								numeric={column.numeric}
								padding={column.disablePadding ? 'none' : 'default'}
								sortDirection={orderBy === column.id ? order : false}
							>
								<Tooltip
									title="Sort"
									placement={column.numeric ? 'bottom-end' : 'bottom-start'}
									enterDelay={300}
								>
									<TableSortLabel
										active={orderBy === column.id}
										direction={order}
										onClick={this.createSortHandler(column.id)}
									>
										{column.label}
									</TableSortLabel>
								</Tooltip>
							</TableCell>
						);
					}, this)}
				</TableRow>
			</TableHead>
		);
	}
}

TaskTableHeader.propTypes = {
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.string.isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired
};

const toolbarStyles = (theme) => ({
	root: {
		paddingRight: theme.spacing.unit
	},
	highlight:
		theme.palette.type === 'light'
			? {
					color: theme.palette.secondary.main,
					backgroundColor: lighten(theme.palette.secondary.light, 0.85)
				}
			: {
					color: theme.palette.text.primary,
					backgroundColor: theme.palette.secondary.dark
				},
	spacer: {
		flex: '1 1 100%'
	},
	actions: {
		color: theme.palette.text.secondary
	},
	title: {
		flex: '0 0 auto'
	}
});

let EnhancedTableToolbar = (props) => {
	const { numSelected, classes } = props;

	return (
		<Toolbar
			className={classNames(classes.root, {
				[classes.highlight]: numSelected > 0
			})}
		>
			<div className={classes.title}>
				{numSelected > 0 ? (
					<Typography color="inherit" variant="subheading">
						{numSelected} selected
					</Typography>
				) : (
					<Typography variant="title" id="tableTitle" />
				)}
			</div>
			<div className={classes.spacer} />
			<div className={classes.actions}>
				{numSelected > 0 ? (
					<Tooltip title="Delete">
						<IconButton aria-label="Delete">
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				) : (
					<Tooltip title="Filter list">
						<IconButton aria-label="Filter list">
							<FilterListIcon />
						</IconButton>
					</Tooltip>
				)}
			</div>
		</Toolbar>
	);
};

EnhancedTableToolbar.propTypes = {
	classes: PropTypes.object.isRequired,
	numSelected: PropTypes.number.isRequired
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = (theme) => ({
	root: {
		width: '100%',
		marginTop: theme.spacing.unit * 2,
		boxShadow: 'none'
	},
	cat: {
		display: 'flex',
		flexDirection: 'row'
	},
	button: {
		width: 40,
		height: 40
	},

	critical: {
		margin: 2,
		width: 16,
		height: 16,
		fontSize: 10,
		color: '#fff',
		backgroundColor: '#e62e00'
	},
	high: {
		margin: 2,
		width: 16,
		height: 16,
		fontSize: 10,
		color: '#fff',
		backgroundColor: '#ffa31a'
	},
	normal: {
		margin: 2,
		width: 16,
		height: 16,
		fontSize: 10,
		color: '#fff',
		backgroundColor: '#2eb82e'
	},

	table: {
		minWidth: 1020,
		elevation: 0
	},
	tableWrapper: {
		overflowX: 'auto'
	}
});

class TaskTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			order: 'desc',
			orderBy: 'ecb_id',
			selected: [],
			data: props.data,
			page: 0,
			rowsPerPage: 5
		};
	}

	handleRequestSort = (event, property) => {
		const orderBy = property;
		let order = 'desc';

		if (this.state.orderBy === property && this.state.order === 'desc') {
			order = 'asc';
		}

		this.setState({ order, orderBy });
	};

	handleClick = (event, task) => {
		this.props.onEdit(task);
	};

	handleChangePage = (event, page) => {
		this.setState({ page });
	};

	handleDelete = (event, task_id) => {
		this.props.onDeleteTask(task_id);
	};

	handleChangeRowsPerPage = (event) => {
		this.setState({ rowsPerPage: event.target.value });
	};

	activeCheck = (value) => {
		const { classes } = this.props;
		if (value > 1) {
			return <Avatar className={classes.critical}>C</Avatar>;
		}
		if (value > 0) {
			return <Avatar className={classes.high}>H</Avatar>;
		} else {
			return <Avatar className={classes.normal}>N</Avatar>;
		}
	};

	isSelected = (id) => this.state.selected.indexOf(id) !== -1;

	render() {
		const { classes } = this.props;
		const { order, orderBy, selected, rowsPerPage, page } = this.state;

		const { data, isEdit } = this.props;

		const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

		return (
			<Paper className={classes.root}>
				<EnhancedTableToolbar numSelected={selected.length} />
				<div className={classes.tableWrapper}>
					<Table className={classes.table} aria-labelledby="tableTitle">
						<TaskTableHeader
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={this.handleSelectAllClick}
							onRequestSort={this.handleRequestSort}
							rowCount={data.length}
						/>
						<TableBody>
							{data
								.sort(getSorting(order, orderBy))
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((n) => {
									return (
										<TableRow hover role="checkbox" tabIndex={-1} key={n.id}>
											<TableCell>{n.title}</TableCell>
											<TableCell>{n.assigned}</TableCell>
											<TableCell>{moment(n.date).format('Do MMM YYYY')}</TableCell>
											<TableCell>{moment(n.deadline).format('Do MMM YYYY')}</TableCell>
											<TableCell>{n.status}</TableCell>
											<TableCell>{this.activeCheck(n.priority)}</TableCell>
											<TableCell>{n.type}</TableCell>
											<TableCell>
												{isEdit == true ? (
													<IconButton
														className={classes.button}
														mini
														aria-label="Edit"
														onClick={(event) => this.handleClick(event, n)}
													>
														<EditIcon />
													</IconButton>
												) : (
													<IconButton
														className={classes.button}
														mini
														aria-label="Edit"
														onClick={(event) => this.handleDelete(event, n.id)}
													>
														<DeleteIcon />
													</IconButton>
												)}
											</TableCell>
										</TableRow>
									);
								})}
							{emptyRows > 0 && (
								<TableRow style={{ height: 49 * emptyRows }}>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<TablePagination
					component="div"
					count={data.length}
					rowsPerPage={rowsPerPage}
					page={page}
					backIconButtonProps={{
						'aria-label': 'Previous Page'
					}}
					nextIconButtonProps={{
						'aria-label': 'Next Page'
					}}
					onChangePage={this.handleChangePage}
					onChangeRowsPerPage={this.handleChangeRowsPerPage}
				/>
			</Paper>
		);
	}
}

TaskTable.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TaskTable);
