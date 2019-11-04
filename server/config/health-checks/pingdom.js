module.exports = {
	name: 'App responds properly',
	checks: [
		{
			name: 'Health',
			type: 'pingdom',
			checkId: '3318043',
			interval: '1minute',
			checkResult: {
				PASSED: 'Responded successfully',
				FAILED: 'Invalid response',
				PENDING: 'This check has not yet run'
			},
			severity: 1,
			businessImpact: 'Users will be unable to submit their business details.',
			technicalSummary: 'Pingdom either received a non-200 status code or could not find a form element on the page',
			panicGuide: 'See https://next-b2b-prospect.ft.com/form and validate a form is rendered. Contact the Conversion team #next-conversion-dev.'
		},
	]
};
