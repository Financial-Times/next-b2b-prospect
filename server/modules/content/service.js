const fetchres = require('fetchres');

export default {

	createAccessToken: ({ uuid, tokenLifetimeMinutes = 60, fetch = global.fetch }) => {
		const expiryTime = new Date(Date.now() + (1000 * 60 * tokenLifetimeMinutes));
		return fetch(`${process.env.CONTENT_ACCESS_TOKEN_SVC_URL}/sign`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': process.env.CONTENT_ACCESS_TOKEN_SVC_KEY
			},
			body: JSON.stringify({
				contentUUIDs: [ uuid ],
				expiryTime
			})
		})
		.then(fetchres.json);
	}

};
