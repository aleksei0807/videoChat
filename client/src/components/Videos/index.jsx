import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import styles from './index.css';

function mapStateToProps(state) {
	return {
		callObj: state.call,
	};
}

@connect(mapStateToProps)
@CSSModules(styles, {allowMultiple: true})
export default class Videos extends Component {
	render() {
		const { localVideo, remoteVideo } = this.props.callObj;

		return (
			<div styleName={`container${remoteVideo ? ' withRemote' : ''}`}>
				{remoteVideo ? <video src={remoteVideo} autoPlay /> : null}
				{localVideo ? <video src={localVideo} autoPlay muted /> : null}
			</div>
		);
	}
}
