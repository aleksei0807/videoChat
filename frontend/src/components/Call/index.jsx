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
@CSSModules(styles, {allowMultiple: true})
export default class Call extends Component {
	constructor(...args) {
		super(...args);
		this.state = {
			callToUsername: '',
			error: false,
			showContainer: false,
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

	toggleMobile = () => {
		this.setState({
			showContainer: !this.state.showContainer,
		});
	}

	render() {
		const { remoteVideo } = this.props.callObj;

		return (
			<div styleName="call">
				{!remoteVideo ? (
					<button styleName="mobile" onClick={this.toggleMobile}>Call</button>
				) : null}
				{!remoteVideo ? (
					<div styleName={`container${this.state.showContainer ? '' : ' hide'}`}>
						{this.props.callObj.error || this.state.error || null}
						<form onSubmit={this.call}>
							<label htmlFor="callEmail">Call to: </label>
							<input
								id="callEmail"
								name="callEmail"
								type="email"
								placeholder="email"
								value={this.state.callToUsername}
								onChange={this.changeCall}
								/>
							<button>Call</button>
						</form>
					</div>
				) : null}
				{remoteVideo ? (
					<button
						type="button"
						onClick={this.hangUp}>
					Hang Up
					</button>
				) : null}
			</div>
		);
	}
}
