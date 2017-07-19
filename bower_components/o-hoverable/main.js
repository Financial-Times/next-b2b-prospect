/* globals DocumentTouch */

function Hoverable() {

	let hasContact = false;
	let contactlessMoves = 0;
	let lastClientX;
	let lastClientY;
	const eventmap = [
		['touchstart', contactStart],
		['mousedown', contactStart],
		['mspointerdown', contactStart],
		['touchend',contactEnd],
		['mouseup', contactEnd],
		['mspointerup', contactEnd],
		['mousemove', contactMove],
		['mspointerhover', contactMove]
	];
	let className = 'o-hoverable-on';
	let htmlClassList;

	function init() {
		window.document.documentElement.setAttribute('data-o-hoverable--js', '');
		touchSupport();
	}

	// If HTML has hover effects enabled, and device appears to support touch
	// remove hover effects and start listening for pointer interactions
	function touchSupport() {
		htmlClassList = window.document.documentElement.classList;

		if (classExists() && (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch)) {
			htmlClassList.remove(className);

			eventmap.forEach(function(item) {
				listener('add', item[0], item[1]);
			});
		}
	}

	function contactStart() {
		hasContact = true;
		contactlessMoves = 0;
	}

	function contactEnd() {
		hasContact = false;
	}

	// If a contactless move (ie a hover) is detected, turn hover effects back on
	function contactMove(event) {
		if (!hasContact) {
			contactlessMoves++;
		}

		if ('mousemove' === event.type.toLowerCase()) {

			// COMPLEX:GC:20130322: Webkit can fire an erroneous mousemove under some conditions, so
			// keep a track of the clientX and clientY values, and reject events where these values don't change.
			if (lastClientX === event.clientX && lastClientY === event.clientY) {
				return;
			}
			lastClientX = event.clientX;
			lastClientY = event.clientY;
		}

		// MSPointerHover categorically means a contactless interaction
		if (contactlessMoves > 1 || event.type.toLowerCase() === 'mspointerhover') {
			htmlClassList.add(className);

			eventmap.forEach(function(item) {
				listener('remove', item[0], item[1]);
			});
		}
	}

	function listener(type, event, fn) {
		window[type + 'EventListener'](event, fn, false);
	}

	function classExists() {
		return htmlClassList.contains(className);
	}

	function destroy() {
		window.document.documentElement.removeAttribute('data-o-hoverable--js');

		eventmap.forEach(function(item) {
			listener('remove', item[0], item[1]);
		});
	}

	init();

	return {
		setClassName: function(str) {
			className = str;
			touchSupport();
		},
		destroy: destroy,
		isHoverEnabled: classExists
	};
}

Hoverable.init = function() {
	if (!window.document.documentElement.hasAttribute('data-o-hoverable--js')) {
		document.removeEventListener('o.DOMContentLoaded', Hoverable.init);
		return new Hoverable();
	}
};

document.addEventListener('o.DOMContentLoaded', () => Hoverable.init() );

module.exports = Hoverable;
