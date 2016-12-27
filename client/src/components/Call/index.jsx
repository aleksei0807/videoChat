import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import { send } from '../../actions/connection';
import {
	call,
	handleLeave,
	peerConnection,
	changeLocalVideo,
	changeRemoteVideo,
} from '../../actions/call';
import getUserMedia from '../../utils/getUserMedia';
import emailRegexp from '../../utils/emailRegexp';
import styles from './index.css';

getUserMedia(); // Polyfill

function mapStateToProps(state) {
	return {
		callObj: state.call,
	};
}

@connect(mapStateToProps, {
	send,
	peerConnection,
	call,
	handleLeave,
	changeLocalVideo,
	changeRemoteVideo,
})
@CSSModules(styles)
export default class Call extends Component {
	constructor(...args) {
		super(...args);
		this.state = {
			callToUsername: '',
			error: false,
		};
	}

	componentWillMount() {
		navigator.mediaDevices.getUserMedia({ audio: true, video: true })
		.then(this.streaming)
		.catch(this.streamingError);
	}

	streaming = (myStream) => {
		const stream = myStream;

		const localVideo = window.URL.createObjectURL(stream);
		this.props.changeLocalVideo(localVideo);

		this.props.peerConnection(stream, (remoteStream) => {
			const remoteVideo = window.URL.createObjectURL(remoteStream);
			this.props.changeRemoteVideo(remoteVideo);
		});
	}

	streamingError = (error) => {
		console.log(error);
	}

	changeCall = (e) => {
		this.setState({
			callToUsername: e.target.value,
		});
	}

	call = (e) => {
		e.preventDefault();
		if (emailRegexp.test(this.state.callToUsername)) {
			this.setState({
				error: false,
			});
			this.props.call(this.state.callToUsername);
		} else {
			this.setState({
				error: 'Email is not valid!',
			});
		}
	}

	hangUp = () => {
		this.props.send({
			type: 'leave',
		});

		this.props.handleLeave();
	}

	render() {
		const { remoteVideo } = this.props.callObj;

		return (
			<div styleName="container">
				{this.props.callObj.error || this.state.error || null}
				{!remoteVideo ? (
					<form onSubmit={this.call}>
						<label htmlFor="callEmail" className="label">Call to: </label>
						<input
							id="callEmail"
							name="callEmail"
							type="email"
							placeholder="email"
							value={this.state.callToUsername}
							onChange={this.changeCall}
							/>
						<button className="btn-success btn">Call</button>
					</form>
				) : null}
				{remoteVideo ? (
					<button
						type="button"
						onClick={this.hangUp}
						className="btn-danger btn">
						Hang Up
					</button>
				) : null}
			</div>
		);
	}
}
