const localStorage = require('superstore-sync').local;
const dateToday = require('./helpers/date-today');

const COUNTER_ADBLOCKING_SEEN = 'counter-ad-blocking-seen';
const COUNTER_ADBLOCKING_CLOSED = 'counter-ad-blocking-closed';
const COUNTER_ADBLOCKING_DAYS = 'counter-ad-blocking-days';

module.exports = () => {
	const maxTimes = 3;
	const seenToday = localStorage.get(COUNTER_ADBLOCKING_SEEN) === dateToday();
	const closedToday = localStorage.get(COUNTER_ADBLOCKING_CLOSED) === dateToday();
	let daysSeen = localStorage.get(COUNTER_ADBLOCKING_DAYS) || 0;

	if (closedToday) {
		return false;
	}

	if (seenToday) {
		return 'banner';
	}

	if (daysSeen < maxTimes) {
		daysSeen++;
		localStorage.set(COUNTER_ADBLOCKING_SEEN, dateToday());
		localStorage.set(COUNTER_ADBLOCKING_DAYS, daysSeen);
		return 'banner';
	}

	return false;
};
