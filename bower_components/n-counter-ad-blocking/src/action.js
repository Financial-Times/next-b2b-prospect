const broadcast = require('n-ui-foundations').broadcast;
const overlay = require('./overlay');
const banner = require('./banner');

module.exports = (options) => {

	switch (options && options.type) {
		case 'overlay':
			overlay(options);
			break;
		case 'banner':
			banner(options);
			break;
		default:
			return;
	}

	// send tracking for action taken
	const event = (options) => {
		return {
			category: 'ads',
			action: 'counter-ad-blocking',
			context: {
				type: options.type,
				close: options.close,
				action: 'shown'
			}
		};
	};

	broadcast('oTracking.event', event(options));
};
