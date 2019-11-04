import FormComponent from './components/form';
import SubmissionComponent from './components/submission';
import ConfirmationComponent from './components/confirmation';
import domLoaded from 'dom-loaded';

domLoaded.then(() => {
	const form = document.querySelector('[data-o-component="o-forms"]');
	const submissionEl = document.querySelector('[data-page="submission"]');
	const confirmationEl = document.querySelector('[data-page="confirmation"]');

	if (form) {
		FormComponent.init(form);
	}

	if (submissionEl) {
		SubmissionComponent.init(submissionEl);
	}

	if (confirmationEl) {
		ConfirmationComponent.init(confirmationEl);
	}
});
