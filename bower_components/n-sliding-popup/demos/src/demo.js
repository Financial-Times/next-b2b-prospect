import './../../main.js';

document.addEventListener('DOMContentLoaded', function() {
	const status = document.querySelector('#status');
	document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
	const els = document.querySelectorAll('[data-n-component="n-sliding-popup"]');
	for(let i = 0; i < els.length; i+=1) {
		setTimeout((el) => {
			el.setAttribute('data-n-sliding-popup-visible', 'true');
			el.onClose = () => {
				status.textContent = 'Closed';
			};
		}, (i * 2000) + 2000, els[i]);
	}
});
