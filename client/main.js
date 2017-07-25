import { bootstrap } from 'n-ui';
require('o-forms');

bootstrap({
	preset: 'discrete',
	header: false,
	footer: false
}, () => {
	document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
});
