module.exports = [
	{
		method: 'GET',
		urls: {
			'/form': 200
		}
	},
	{
		method: 'POST',
		body: {
			firstName: 'Smokey',
			lastName: 'Bacon',
			company: 'Streaky'
		},
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		urls: {
			'/form?pa11y=true': 200
		}
	}
];
