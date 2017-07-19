const counterAdBlockActions = require('../../src/qualification');
const counterAdBlockCheck = require('../../main');

document.addEventListener('DOMContentLoaded', function () {
	document.dispatchEvent(new CustomEvent('n.DOMContentLoaded'));
});

function setUpDemo () {
	document.removeEventListener('n.DOMContentLoaded', setUpDemo);

	// set up conditions under which ad block overlay will run
	const el = document.querySelector('.o-grid-container');
	el.className += ' js-success';
	el.dataset.nextApp = 'article';

	const cohortType = document.getElementById('cohort-type__js').dataset.type;
	const overlayButton = document.getElementById('overlay-button__js');
	const overlaySeenResetButton = document.getElementById('overlay-seen-reset-button__js');

	//HACK uses data in DOM to set flags corresponding to non-close (hard) or closeable (soft) overlay
	const flags = { get: function (flag) {
		switch (flag) {
			case 'sourcepoint':
				return 'true';
				break;
			case 'adCounterBlocking':
				return true;
				break;
			case 'adCounterBlockingDummyRegistered':
				return cohortType === 'registered' ? true : false;
				break;
			case 'subsB2cAdBlockingCohort':
				return cohortType === 'b2c-subscriber' ? 'true' : false;
				break;
			default:
				return false;
		}
	}};

	function triggerAdBlockCheck () {
		counterAdBlockCheck.init(flags);
	}

	function resetOverlaySeen () {
		localStorage.removeItem('counter-ad-blocking-seen');
		localStorage.removeItem('counter-ad-blocking-closed');
		localStorage.removeItem('counter-ad-blocking-days');
	}

	if (overlaySeenResetButton) {
		overlaySeenResetButton.addEventListener('click', resetOverlaySeen);
	}

	if (overlayButton) {
		overlayButton.addEventListener('click', triggerAdBlockCheck);
	} else {
		counterAdBlockActions(flags);
	}

};

document.addEventListener('n.DOMContentLoaded', setUpDemo);
