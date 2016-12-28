import fs from 'fs';
import https from 'https';
import express from 'express';
import { Server as WebSocketServer } from 'ws';

const privateKey = fs.readFileSync('sslcert/key.pem', 'utf8');
const certificate = fs.readFileSync('sslcert/cert.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate };
const app = express();

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(9090, '10.2.0.1');

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
			console.log('User logged', data.name);

			if (users[data.name]) {
				sendTo(localConnection, {
					type: 'login',
					success: false,
				});
			} else {
				users[data.name] = localConnection;
				localConnection.name = data.name;

				sendTo(localConnection, {
					type: 'login',
					success: true,
				});
			}

			break;
		}
		case 'logout': {
			console.log('User logout', data.name);

			if (users[data.name]) {
				delete users[data.name];

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
			console.log('Sending offer to: ', data.name);

			const conn = users[data.name];

			if (conn) {
				localConnection.otherName = data.name;
				sendTo(conn, {
					type: 'offer',
					offer: data.offer,
					name: localConnection.name,
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
			console.log('Sending answer to: ', data.name);
			const conn = users[data.name];

			if (conn) {
				localConnection.otherName = data.name;
				sendTo(conn, {
					type: 'answer',
					answer: data.answer,
				});
			}

			break;
		}

		case 'candidate': {
			console.log('Sending candidate to: ', data.name);
			const conn = users[data.name];

			if (conn) {
				sendTo(conn, {
					type: 'candidate',
					candidate: data.candidate,
				});
			}

			break;
		}

		case 'leave': {
			console.log('Disconnecting from ', data.name);
			const conn = users[data.name];

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
		if (connection.name) {
			delete users[connection.name];

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
