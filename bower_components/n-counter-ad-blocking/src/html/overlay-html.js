const overlayImage = 'https://www.ft.com/__assets/creatives/ad-blocking/browser-frontpage-whitelisting.svg%3Fcachebust%3D21-02-2017';
const imageService = `https://www.ft.com/__origami/service/image/v2/images/raw/${overlayImage}?source=next&quality=highest&dpr=2`;


module.exports = (options) => {
	let closeButton = '';
	if (options && options.close === true) {
		closeButton = '<a class="o-overlay__close" role="button" tabindex="0" href="javascript:void(0)" data-trackable="close" aria-label="Close" title="Close"></a>';
	}
	const continueText = options && options.close === true ? 'support our journalism' : 'continue';
	return `
		<div tabindex="-1" class="o-grid-container counter-adblock" data-trackable="counter-adblock-overlay">
			<div class="o-grid-row">
				<div class="counter-adblock__block--left" data-o-grid-colspan="12 L7">
					<h2 class="counter-adblock__title">We understand your decision to use an ad blocker…</h2>
					<p class="counter-adblock__text">However FT journalism requires funding from both subscriptions and advertising.</p>
					<p class="counter-adblock__text">Please <span class="counter-adblock__text--bold">whitelist ft.com in your ad blocker</span> then refresh your browser to ${continueText}.</p>
					<button onclick="location.href = 'http://help.ft.com/help/advertising/';" class="counter-adblock__button o-buttons o-buttons--inverse o-buttons--big" data-trackable="help-centre">Help Centre</button>
					<ul class="counter-adblock__list">
						<li class="counter-adblock__list-item">
							<a class="counter-adblock__link" href="http://help.ft.com/help/advertising/advertising-on-the-ft/what-is-the-fts-advertising-policy/" data-trackable="advertising-policy" data-original-title="" title="">FT advertising policy</a>
						</li>
						<li class="counter-adblock__list-item">
							<a class="counter-adblock__link" href="http://help.ft.com/help/contact-us/" data-trackable="contact-us" data-original-title="" title="">Contact Us</a>
						</li>
						<li class="counter-adblock__list-item">
							<a class="counter-adblock__link" href="http://help.ft.com/help/legal/your-privacy-and-adblocking-detection/" data-trackable="privacy" data-original-title="" title="">Privacy</a>
						</li>
					</ul>
				</div>
				<div class="counter-adblock__block--right" data-o-grid-colspan="12 L5">
					<img class="counter-adblock__image" src="${imageService}" alt="How to whitelist ft.com" role="presentation">
				</div>
			</div>
			${closeButton}
		</div>
	`;
};
