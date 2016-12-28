export default function getUserMediaPolyfill() {
	if (navigator.mediaDevices === undefined) {
		navigator.mediaDevices = {};
	}

	if (navigator.mediaDevices.getUserMedia === undefined) {
		navigator.mediaDevices.getUserMedia = constraints => {
			const getUserMedia = (navigator.getUserMedia ||
				navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia);

			if (!getUserMedia) {
				return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
			}

			return new Promise((resolve, reject) => {
				getUserMedia.call(navigator, constraints, resolve, reject);
			});
		};
	}
}
