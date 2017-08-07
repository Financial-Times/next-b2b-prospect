const FormComponent = require('./components/form');
const ConfirmationComponent = require('./components/confirmation');

const form = document.querySelector('[data-o-component="o-forms"]');
const confirmation = document.querySelector('[data-submission-token]');

if (form) {
	FormComponent.init(form);
}

if (confirmation) {
	ConfirmationComponent.init(confirmation);
}
