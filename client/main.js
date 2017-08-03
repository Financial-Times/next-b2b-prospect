const OForms = require('o-forms');

const overlay = document.querySelector('.prospect-form__overlay');
const errorMessage = document.querySelector('.prospect-form__message');
const formsEl = document.querySelector('[data-o-component="o-forms"]');

function notifyParentFrame() {
	// Add 5 just for padding etc
	parent.postMessage(formsEl.clientHeight + 5, '*');
}

if (formsEl) {
	new OForms(formsEl);

	if(errorMessage) {
		notifyParentFrame();
	}

	var observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => {
			if(mutation.target.className.includes('error')) {
				notifyParentFrame();
			}
		});
	});

	var config = { subtree: true, attributes: true };
	observer.observe(formsEl, config);

	formsEl.addEventListener("submit", () => {
		overlay.classList.add('prospect-form__overlay--active');
	});

}
