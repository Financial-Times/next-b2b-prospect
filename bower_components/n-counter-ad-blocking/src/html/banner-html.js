module.exports = (options) => {
	let closeButton = '';
	if (options && options.close === true) {
		closeButton = '<a class="o-overlay__close" role="button" tabindex="0" href="javascript:void(0)" data-trackable="close" aria-label="Close" title="Close"></a>';
	}
	return `
		<div class="o-grid-container counter-adblock">
			<div data-o-grid-colspan="12 L8 XL7" class="counter-adblock__text">
				<p><span class="counter-adblock__text--bold">Please whitelist FT.com in your ad blocker.</span><br/>Our journalism requires funding from both subscription and advertising.</p>
			</div>
			<div data-o-grid-colspan="12 L2 XL3">
				<button onclick="location.href = 'https://help.ft.com/help/advertising/ad-blocking/how-do-i-whitelist-ft-com-in-my-ad-blocker/';" class="counter-adblock__button o-buttons o-buttons--inverse o-buttons--big" data-trackable="help-centre">See how to whitelist</button>
			</div>
			<div data-o-grid-colspan="12 M1">
				<a class="counter-adblock__link" href="http://help.ft.com/help/legal/your-privacy-and-adblocking-detection/" data-trackable="privacy" data-original-title="" title="">Privacy</a>
			</div>
			<div data-o-grid-colspan="12 M1">
				${closeButton}
			</div>
		</div>
	`;
};
