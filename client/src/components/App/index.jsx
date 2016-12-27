/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import { connection } from '../../actions/connection';
import { logout } from '../../actions/user';
import Login from '../Login';
import Call from '../Call';
import Videos from '../Videos';
import styles from './index.css';
import bg from './bg.jpg';

function mapStateToProps(state) {
	return {
		user: state.user,
	};
}

@connect(mapStateToProps, { connection, logout })
@CSSModules(styles)
export default class App extends Component {
	componentWillMount() {
		this.props.connection();
	}

	render() {
		const { user } = this.props;

		return (
			<div
				styleName="container"
				style={{
					backgroundImage: `url(${bg})`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					backgroundPosition: 'center right',
				}}>
				<div styleName="header">
					{user.email && <Call email={user.email} />}
					<h2>Secret Video Chat</h2>
					{user.email ? (
						<div>
							{user.logoutError ? <span>Logout error</span> : null}
							{user.email}
							<button
								className="btn"
								onClick={this.props.logout}>
								Logout
							</button>
						</div>
					) : null}
				</div>
				{!user.email ? (
					<div styleName="center">
						<Login user={user} />
					</div>
				) : null}
				{user.email && <Videos />}
			</div>
		);
	}
}
