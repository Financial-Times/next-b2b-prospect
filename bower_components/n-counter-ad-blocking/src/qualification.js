const action = require('./action');
const b2cDecision = require('./b2c-decision');

const APPS_FOR_COUNTER_ADBLOCKING = [
	'article',
	'front-page',
	'stream-page'
];

const MIN_WIDTH_TO_ACTIVATE = 980;

module.exports = function (flags) {
	// only run if width above specified threshold
	const viewportWidth = window.innerWidth;
	if (viewportWidth < MIN_WIDTH_TO_ACTIVATE) return;
	// only run if on specific apps
	const el = document.querySelector('.js-success');
	const app = el && el.dataset && el.dataset.nextApp;
	if (APPS_FOR_COUNTER_ADBLOCKING.indexOf(app) === -1) return;
	// HACK to stop it appearing on video article pages until videos moved to diff app
	if (app === 'article' && document.querySelector('.content__video')) return;
	// set up overlay options
	// type - overlay or banner
	// close - (applicable to overlay only) true for close button, false for no close button
	const options = {};
	// Dummy flags are for testing purposes, right hand side names are for real usage
	if (flags.get('adCounterBlockingDummyRegistered') || flags.get('registeredAdBlockingCohort')) {
		options.close = false;
		options.type = 'overlay';
	}
	if (flags.get('subsB2cAdBlockingCohort')) {
		options.close = true;
		options.type = b2cDecision();
	}

	// if not matched a cohort we return
	if (!options.type) return;

	action(options);
};
