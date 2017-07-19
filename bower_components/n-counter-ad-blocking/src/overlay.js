const Overlay = require('o-overlay');
const overlayHtml = require('./html/overlay-html');

module.exports = (options) => {

	const overlayOptions = {
		html: overlayHtml(options),
		modal: true,
		preventclosing: options && options.close === false,
		customclose: options && options.close !== false
	};

	const adBlockingOverlay = new Overlay('counter-ad-block', overlayOptions);

	adBlockingOverlay.open();

	// Prevent scrolling of page behind overlay
	document.body.classList.add('counter-adblock__prevent-scroll');
	document.documentElement.classList.add('counter-adblock__prevent-scroll');

	const removeScrollBlock = () => {
		document.removeEventListener('oOverlay.destroy', removeScrollBlock);
		document.body.classList.remove('counter-adblock__prevent-scroll');
		document.documentElement.classList.remove('counter-adblock__prevent-scroll');
	};

	document.addEventListener('oOverlay.destroy', removeScrollBlock);

};
