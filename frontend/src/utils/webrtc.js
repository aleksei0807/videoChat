export const PeerConnection = window.RTCPeerConnection
	|| window.webkitRTCPeerConnection
	|| window.mozRTCPeerConnection;

export const configuration = {
	iceServers: [
		{
			urls: 'stun:stun2.1.google.com:19302',
		},
	],
};
