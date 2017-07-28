const OForms = require('o-forms');
const formsEl = document.querySelector('[data-o-component="o-forms"]');

if (formsEl) {
	new OForms(formsEl)
}
