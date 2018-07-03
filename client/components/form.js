const OForms = require('o-forms');
import { sendMessage, dispatchTrackingEvent } from './utils';

const overlay = document.querySelector('.prospect-form__overlay');

const notify = (form) => {
  sendMessage({
    height: form.clientHeight + 20
  });
};

export default {

	init: (formEl) => {
		new OForms(formEl);

  	notify(formEl);

  	var observer = new MutationObserver(mutations => {
  		mutations.forEach(mutation => {
  			if(mutation.target.className.includes('error')) {
  				notify(formEl);
  			}
  		});
  	});

  	var config = { subtree: true, attributes: true };
  	observer.observe(formEl, config);

  	formEl.addEventListener('submit', () => {
  		overlay.classList.add('prospect-form__overlay--active');
  	});

    dispatchTrackingEvent({
      category: 'b2b-prospect',
      action: 'landing'
    });

  }

};
