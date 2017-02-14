/* @flow */
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './index.css';

@CSSModules(styles, { allowMultiple: true })
export default class Error extends Component {
	static propTypes = {
		message: PropTypes.string,
	};

	render() {
		const { message } = this.props;

		return (
			<div styleName={`container${message ? ' show' : ''}`}>
				<span styleName="message">{message}</span>
			</div>
		);
	}
}
