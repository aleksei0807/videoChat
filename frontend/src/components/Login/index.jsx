/* @flow */
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import emailRegexp from '../../utils/emailRegexp';
import styles from './index.css';

@CSSModules(styles)
export default class Login extends Component {
	/* eslint-disable react/sort-comp */
	state: {
		email: string;
		error: ?string;
	};

	static propTypes = {
		user: PropTypes.shape({
			email: PropTypes.string,
			error: PropTypes.bool,
		}),
		login: PropTypes.func,
	};

	constructor(...args: Array<*>) {
		super(...args);
		this.state = {
			email: '',
			error: null,
		};
	}
	/* eslint-enable react/sort-comp */

	login = (e: Object) => {
		e.preventDefault();
		if (emailRegexp.test(this.state.email)) {
			this.setState({
				error: null,
			});
			this.props.login(this.state.email);
		} else {
			this.setState({
				error: 'Email is not valid!',
			});
		}
	}

	changeEmail = (e: Object) => {
		this.setState({
			email: e.target.value,
		});
	}

	render() {
		const { error } = this.props.user;

		return (
			<div styleName="container">
				<h3 styleName="title">Please sign in</h3>
				<form onSubmit={this.login}>
					{error ? <span>Ooops...try a different email</span> : null}
					{this.state.error}
					<label htmlFor="emailInput" className="label">Your email</label>
					<input
						id="emailInput"
						name="emailInput"
						type="email"
						className="input"
						placeholder="Your email"
						value={this.state.email}
						onChange={this.changeEmail}
						required
						autoFocus
						/>
					<button
						className="btn">
						Sign in
					</button>
				</form>
			</div>
		);
	}
}
