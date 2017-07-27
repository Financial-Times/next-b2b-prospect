const fetchres = require('fetchres');

module.exports =



export default {

	createAccessToken: ({ uuid }) => {
		const expiryTime = new Date();
		expiryTime.setMinutes(expiryTime.getMinutes() + 5);

		return fetch(process.env.CONTENT_ACCESS_TOKEN_SVC_URL, {
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
