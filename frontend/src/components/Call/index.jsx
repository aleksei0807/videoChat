/* @flow */
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import emailRegexp from '../../utils/emailRegexp';
import styles from './index.css';

@CSSModules(styles, { allowMultiple: true })
export default class Call extends Component {
	/* eslint-disable react/sort-comp */
	state: {
		callToUsername: string;
		showContainer: boolean;
	};

	static propTypes = {
		email: PropTypes.string,
		callObj: PropTypes.shape({
			email: PropTypes.string,
		}).isRequired,
		video: PropTypes.shape({
			localVideo: PropTypes.string,
			remoteVideo: PropTypes.string,
		}).isRequired,
		call: PropTypes.func.isRequired,
		hangUp: PropTypes.func.isRequired,
	};

	constructor(...args: Array<*>) {
		super(...args);
		this.state = {
			callToUsername: '',
			showContainer: false,
		};
	}
	/* eslint-enable react/sort-comp */

	changeCall = (e: Event) => {
		if (e.target instanceof HTMLInputElement) {
			this.setState({
				callToUsername: e.target.value,
			});
		}
	}

	call = (e: Event) => {
		e.preventDefault();
		if (emailRegexp.test(this.state.callToUsername)) {
			this.props.setError(null);
			this.props.call(this.state.callToUsername);
		} else {
			this.props.setError('Email is not valid!');
		}
	}

	toggleMobile = () => {
		this.setState({
			showContainer: !this.state.showContainer,
		});
	}

	render() {
		const { remoteVideo } = this.props.video;

		return (
			<div styleName="call">
				{!remoteVideo ? (
					<button styleName="mobile" onClick={this.toggleMobile}>Call</button>
				) : null}
				{!remoteVideo ? (
					<div styleName={`container${this.state.showContainer ? '' : ' hide'}`}>
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
						onClick={this.props.hangUp}>
					Hang Up
					</button>
				) : null}
			</div>
		);
	}
}
