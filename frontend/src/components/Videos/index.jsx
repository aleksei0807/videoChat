/* @flow */
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './index.css';

@CSSModules(styles, { allowMultiple: true })
export default class Videos extends Component {
	static propTypes = {
		video: PropTypes.shape({
			localVideo: PropTypes.string,
			remoteVideo: PropTypes.string,
		}).isRequired,
	};

	render() {
		const { localVideo, remoteVideo } = this.props.video;

		return (
			<div styleName={`container${remoteVideo ? ' withRemote' : ''}`}>
				{remoteVideo ? <video src={remoteVideo} autoPlay muted /> : null}
				{localVideo ? <video src={localVideo} autoPlay muted /> : null}
			</div>
		);
	}
}
