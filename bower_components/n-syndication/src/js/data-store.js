'use strict';

import { broadcast } from 'n-ui-foundations';

import {
	DATA_ID_PROPERTY,
	EVENT_PREFIX,
	FETCH_URI_RESOLVE_SYNDICATABLE_CONTENT,
	FETCH_OPTIONS_RESOLVE_SYNDICATABLE_CONTENT
} from './config';

import { cheapClone, getContentIDFromHTMLElement } from './util';

const DATA_STORE = [];
const DATA_STORE_MAP = {};

function init () {
	addEventListener(`${EVENT_PREFIX}.fetch`, evt => refresh(evt.detail.response), true);
}

function fetchItems (itemIDs) {
	const options = Object.assign(cheapClone(FETCH_OPTIONS_RESOLVE_SYNDICATABLE_CONTENT), {
		body: JSON.stringify(itemIDs)
	});

	return fetch(FETCH_URI_RESOLVE_SYNDICATABLE_CONTENT, options).then(response => {
		if (response.ok) {
			return response.json().then(items => {
				broadcast(`${EVENT_PREFIX}.fetch`, {
					request: itemIDs,
					response: items
				});

				return items;
			});
		}
		else {
			return response.text()
				.then(text => {
					throw new Error(`Next ${FETCH_URI_RESOLVE_SYNDICATABLE_CONTENT} responded with "${text}" (${response.status})`);
				});
		}
	}).catch(error => {
		broadcast('oErrors.log', {
			error: error,
			info: {
				component: 'next-syndication-redux'
			}
		});
	});
}

function getItemByHTMLElement (el) {
	const id = getContentIDFromHTMLElement(el);

	return getItemByID(id);
}

function getItemByID (id) {
	return DATA_STORE_MAP[id] || DATA_STORE.find(item => item[DATA_ID_PROPERTY] === id) || null;
}

function getItemIndex (item) {
	let id = item;

	switch (Object.prototype.toString.call(item)) {
		case '[object Object]' :
			id = item[DATA_ID_PROPERTY];

		// allow fall-through
		case '[object String]' :
			return DATA_STORE.findIndex(item => item[DATA_ID_PROPERTY] === id);
	}

	return -1;
}

function refresh (data) {
	const EXISTING = [];

	data.forEach(item => {
		const id = item[DATA_ID_PROPERTY];

		if (id in DATA_STORE_MAP) {
			EXISTING.push(item);

			const existingIndex = DATA_STORE.findIndex(storeItem => storeItem[DATA_ID_PROPERTY] === id);

			if (existingIndex > -1) {
				DATA_STORE[existingIndex] = item;
			}
		}

		if (!EXISTING.includes(item)) {
			DATA_STORE.push(item);
		}

		// replace with new content things may have changed
		DATA_STORE_MAP[id] = item;
	});

	broadcast(`${EVENT_PREFIX}.dataChanged`, {
		existing: EXISTING,
		items: DATA_STORE
	});

	return {
		DATA_STORE,
		DATA_STORE_MAP,
		EXISTING
	};
}

export {
	DATA_STORE,
	DATA_STORE_MAP,
	fetchItems,
	getItemByHTMLElement,
	getItemByID,
	getItemIndex,
	init,
	refresh
};
