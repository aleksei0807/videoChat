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
@CSSModules(styles)
export default class Videos extends Component {
	render() {
		const { localVideo, remoteVideo } = this.props.callObj;

		return (
			<div styleName="container">
				{localVideo ? <video src={localVideo} autoPlay muted /> : null}
				{remoteVideo ? <video src={remoteVideo} autoPlay /> : null}
			</div>
		);
	}
}
