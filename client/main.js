const OForms = require('o-forms');

const overlay = document.querySelector('.prospect-form__overlay');
const errorMessage = document.querySelector('.prospect-form__message');
const formsEl = document.querySelector('[data-o-component="o-forms"]');

if (formsEl) {
	new OForms(formsEl);

	if(errorMessage) {
		parent.postMessage(formsEl.clientHeight, '*');
	}

	var observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => {
			if(mutation.target.className.includes('error')) {
				parent.postMessage(formsEl.clientHeight, '*');
			}
		});
	});

	var config = { subtree: true, attributes: true };
	observer.observe(formsEl, config);

	formsEl.addEventListener("submit", () => {
		overlay.classList.add('prospect-form__overlay--active');
	});

}
