const config = {
	status: 200,
	waitUntil: 'load',
	elements: {
		// Ensure global styles are loaded
		// NOTE: n-test checks whether elements are visible, not whether they are in
		// the DOM. Checking if elements are hidden should indicate that styles loaded.
		'.n-ui-hide-enhanced': false
	}
};

module.exports = [
	{
		method: 'GET',
		urls: {
			'/form': config
		}
	},
	{
		method: 'POST',
		body: "firstName=Smokey&lastName=Bacon&company=Streaky",
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		urls: {
			'/form?pa11y=true': config
		}
	}
];
