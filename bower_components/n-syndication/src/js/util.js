'use strict';

import {
	ATTR_CONTENT_ID
} from './config';

function cheapClone (item) {
	return JSON.parse(JSON.stringify(item));
}

function getContentIDFromHTMLElement (el) {
	do {
		if (el !== document.documentElement) {
			if (el.hasAttribute(ATTR_CONTENT_ID)) {
				let id = el.getAttribute(ATTR_CONTENT_ID);

				// there is a case where an item has a `data-content-id` with no value.
				// I can't figure it out right now, so temporary "fix"...
				if (!id && el.hasAttribute('href')) {
					id = el.getAttribute('href').split('/').pop();

					if (id) {
						el.setAttribute(ATTR_CONTENT_ID, id);
					}
				}

				return id || null;
			}
		}
	} while (el = el.parentElement);

	return null;
}

function toElement (html) {
	const frag = document.createDocumentFragment();

	const ct = document.createElement('div');

	ct.insertAdjacentHTML('afterbegin', html);

	Array.from(ct.children).reverse().forEach(el => frag.prepend(el));

	return frag;
}


export {
	cheapClone,
	getContentIDFromHTMLElement,
	toElement
};
