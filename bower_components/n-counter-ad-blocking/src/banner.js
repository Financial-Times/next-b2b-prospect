const localStorage = require('superstore-sync').local;
const broadcast = require('n-ui-foundations').broadcast;
const bannerHtml = require('./html/banner-html');
const dateToday = require('./helpers/date-today');

const COUNTER_ADBLOCKING_CLOSED = 'counter-ad-blocking-closed';

module.exports = (options) => {

	// send tracking for close banner
	const event = () => {
		return {
			category: 'ads',
			action: 'counter-ad-blocking',
			context: {
				type: 'banner',
				close: 'true',
				action: 'closed'
			}
		};
	};

	const closeBanner = () => {
		const banner = document.querySelector('.counter-adblock__banner');
		if (banner) {
			banner.parentNode.removeChild(banner);
			localStorage.set(COUNTER_ADBLOCKING_CLOSED, dateToday());
			broadcast('oTracking.event', event());
		}
	};

	const banner = document.createElement('div');
	banner.classList.add('counter-adblock__banner');
	banner.dataset.trackable = 'counter-adblock-banner';
	banner.innerHTML = bannerHtml(options);
	document.body.append(banner);
	document.body.classList.add('counter-adblock__banner-margin');

	document.querySelector('.o-overlay__close').onclick = closeBanner;

};
