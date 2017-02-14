import fs from 'fs';
import https from 'https';
import express from 'express';
import { Server as WebSocketServer } from 'ws';
import { backend } from '../../config.json';

const privateKey = fs.readFileSync('sslcert/key.pem', 'utf8');
const certificate = fs.readFileSync('sslcert/cert.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate };
const app = express();

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(backend.port, backend.host);

const wss = new WebSocketServer({
	server: httpsServer,
});

const users = {};

function sendTo(connection, message) {
	connection.send(JSON.stringify(message));
}

wss.on('connection', connection => {
	console.log('User connected');

	connection.on('message', message => {
		let data;
		const localConnection = connection;

		try {
			data = JSON.parse(message);
		} catch (e) {
			console.log('Invalid JSON');
			data = {};
		}

		switch (data.type) {
		case 'login': {
			console.log('User logged', data.email);

			if (users[data.email]) {
				sendTo(localConnection, {
					type: 'login',
					success: false,
				});
			} else {
				users[data.email] = localConnection;
				localConnection.email = data.email;

				sendTo(localConnection, {
					type: 'login',
					success: true,
				});
			}

			break;
		}
		case 'logout': {
			console.log('User logout', data.email);

			if (users[data.email]) {
				delete users[data.email];

				sendTo(localConnection, {
					type: 'logout',
					success: true,
				});
			} else {
				sendTo(localConnection, {
					type: 'logout',
					success: false,
				});
			}
			break;
		}
		case 'offer': {
			console.log('Sending offer to: ', data.email);

			const conn = users[data.email];

			if (conn) {
				localConnection.otherName = data.email;
				sendTo(conn, {
					type: 'offer',
					offer: data.offer,
					email: localConnection.email,
				});
			} else {
				sendTo(localConnection, {
					type: 'error',
					errorType: 'offer',
					message: 'user was not found',
				});
			}

			break;
		}

		case 'answer': {
			console.log('Sending answer to: ', data.email);
			const conn = users[data.email];

			if (conn) {
				localConnection.otherName = data.email;
				sendTo(conn, {
					type: 'answer',
					answer: data.answer,
				});
			}

			break;
		}

		case 'candidate': {
			console.log('Sending candidate to: ', data.email);
			const conn = users[data.email];

			if (conn) {
				sendTo(conn, {
					type: 'candidate',
					candidate: data.candidate,
				});
			}

			break;
		}

		case 'leave': {
			console.log('Disconnecting from ', data.email);
			const conn = users[data.email];

			if (conn) {
				conn.otherName = null;
				sendTo(conn, {
					type: 'leave',
				});
			}

			break;
		}

		default: {
			sendTo(connection, {
				type: 'error',
				message: `Command not found: ${data.type}`,
			});

			break;
		}
		}
	});

	connection.on('close', () => {
		if (connection.email) {
			delete users[connection.email];

			if (connection.otherName) {
				console.log('Disconnecting from ', connection.otherName);
				const conn = users[connection.otherName];

				if (conn) {
					conn.otherName = null;
					sendTo(conn, {
						type: 'leave',
					});
				}
			}
		}
	});

	connection.send(JSON.stringify('Connected'));
});
