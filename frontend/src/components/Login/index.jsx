/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import { login } from '../../actions/user';
import emailRegexp from '../../utils/emailRegexp';
import styles from './index.css';

@connect(null, { login })
@CSSModules(styles)
export default class Login extends Component {
	/* eslint-disable react/sort-comp */
	state: {
		email: string;
		error: false|string;
	};

	constructor(...args: Array<*>) {
		super(...args);
		this.state = {
			email: '',
			error: false,
		};
	}
	/* eslint-enable react/sort-comp */

	login = (e: Object) => {
		e.preventDefault();
		if (emailRegexp.test(this.state.email)) {
			this.setState({
				error: false,
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
					{this.state.error || null}
					{error ? <span>Ooops...try a different email</span> : null}
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
