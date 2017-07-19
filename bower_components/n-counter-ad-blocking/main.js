const broadcast = require('n-ui-foundations').broadcast;
const qualification = require('./src/qualification');

const event = (action) => {

	return {
		category: 'ads',
		action: action,
		context: {
			provider: 'sourcepoint'
		}
	};

};

module.exports = {

	init: (flags) => {

		const spoorIdCheck = /spoor-id/.test(document.cookie);
		if (spoorIdCheck && flags && flags.get('sourcepoint')) {
			document.addEventListener('sp.blocking', () => {
				broadcast('oTracking.event', event('blocked'));
				if (flags.get('adCounterBlocking')) {
					qualification(flags);
				}
			});

			document.addEventListener('sp.not_blocking', () => {
				broadcast('oTracking.event', event('unblocked'));
			});

			const sp = document.createElement('script');
			sp.async = sp.defer = true;
			sp.src = 'https://h2.ft.com/static-files/sp/prod/long/sp/sp-2.js';
			sp.setAttribute('data-client-id', 'pHQAcgfacNTVtzm');
			document.body.appendChild(sp);

		}
	}

};
