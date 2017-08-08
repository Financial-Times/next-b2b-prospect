const OForms = require('o-forms');
import { sendMessage } from './utils';

const overlay = document.querySelector('.prospect-form__overlay');
const errorMessage = document.querySelector('.prospect-form__message');

const notify = (form) => {
  sendMessage({
    height: form.clientHeight + 5
  });
};

export default {

	init: (formEl) => {
  	new OForms(formEl);

  	if(errorMessage) {
  		notify(formEl);
  	}

  	var observer = new MutationObserver(mutations => {
  		mutations.forEach(mutation => {
  			if(mutation.target.className.includes('error')) {
  				notify(formEl);
  			}
  		});
  	});

  	var config = { subtree: true, attributes: true };
  	observer.observe(formEl, config);

  	formEl.addEventListener("submit", () => {
  		overlay.classList.add('prospect-form__overlay--active');
  	});
  }

};
