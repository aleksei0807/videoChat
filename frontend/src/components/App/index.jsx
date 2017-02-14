/* @flow */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import { connection } from '../../actions/connection';
import { logout, login } from '../../actions/user';
import { call, hangUp } from '../../actions/call';
import { setError } from '../../actions/error';
import Login from '../Login';
import Call from '../Call';
import Videos from '../Videos';
import ErrorComponent from '../Error';
import styles from './index.css';
import bg from './bg.jpg';

const mapStateToProps = state => ({
	user: state.user,
	callObj: state.call,
	video: state.video,
	error: state.error,
});

@connect(mapStateToProps, {
	connection,
	logout,
	login,
	call,
	hangUp,
	setError,
})
@CSSModules(styles)
export default class App extends Component {
	static propTypes = {
		user: PropTypes.shape({
			email: PropTypes.string,
			error: PropTypes.bool,
		}),
		callObj: PropTypes.shape({
			email: PropTypes.string,
		}),
		video: PropTypes.shape({
			localVideo: PropTypes.string,
			remoteVideo: PropTypes.string,
		}),
		error: PropTypes.shape({
			message: PropTypes.string,
		}),
		connection: PropTypes.func,
		logout: PropTypes.func,
		login: PropTypes.func,
		call: PropTypes.func,
		hangUp: PropTypes.func,
		setError: PropTypes.func,
	};

	componentWillMount() {
		this.props.connection();
	}

	render() {
		const { user, callObj, video } = this.props;

		const callProps = {
			email: user.email,
			callObj,
			video,
			call: this.props.call,
			hangUp: this.props.hangUp,
			setError: this.props.setError,
		};

		return (
			<div
				styleName="container"
				style={{
					backgroundImage: `url(${bg})`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					backgroundPosition: 'center right',
				}}>
				<header styleName="header">
					{user.email && <Call {...callProps} />}
					<h2>Secret Video Chat</h2>
					{user.email ? (
						<div>
							{user.email}
							<button
								styleName="logout"
								onClick={this.props.logout}>
								Logout
							</button>
						</div>
					) : null}
				</header>
				{!user.email ? (
					<div styleName="center">
						<Login user={user} login={this.props.login} />
					</div>
				) : null}
				{user.email && <Videos video={video} />}
				{<ErrorComponent message={this.props.error.message} />}
			</div>
		);
	}
}
