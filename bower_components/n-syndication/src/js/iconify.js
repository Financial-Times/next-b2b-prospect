'use strict';

import { $$, broadcast } from 'n-ui-foundations';

import {
	ATTR_CONTENT_ID,
	ATTR_CONTENT_TYPE,
	ATTR_SYNDICATED,
	CSS_CLASS_PREFIX,
	CSS_SELECTOR_CONTENT_ID,
	CSS_SELECTOR_NOT_SYNDICATED, DATA_ID_PROPERTY,
	EVENT_PREFIX,
	EXCLUDE_ELEMENTS,
	SYNDICATION_INSERTION_RULES
} from './config';

import {
	DATA_STORE,
	fetchItems
} from './data-store';

import {
	getContentIDFromHTMLElement,
	toElement
} from './util';

function init () {
	addEventListener('asyncContentLoaded', () => syndicate(), true);
	addEventListener(`${EVENT_PREFIX}.dataChanged`, () => updatePage(), true);

	return syndicate();
}

function createElement (item) {
	return toElement(`<button class="${CSS_CLASS_PREFIX}-icon ${CSS_CLASS_PREFIX}-icon-state-${item.canBeSyndicated}" ${ATTR_CONTENT_ID}="${item[DATA_ID_PROPERTY]}" ${ATTR_CONTENT_TYPE}="${item.type}" ${ATTR_SYNDICATED}="true" type="button"></button>`);
}

function findElementToSyndicate (el) {
	if (el !== document.documentElement && !EXCLUDE_ELEMENTS[el.tagName.toUpperCase()]) {
		for (let [match, rule] of Object.entries(SYNDICATION_INSERTION_RULES)) {
			if (el.matches(match)) {
				if (!rule.fn && !rule.slc) {
					return el;
				}

				const targetElement = el[rule.fn](rule.slc);

				if (targetElement) {
					return targetElement;
				}
			}
		}
	}

	return null;
}

function getSyndicatableItems () {
	return $$(`${CSS_SELECTOR_CONTENT_ID}${CSS_SELECTOR_NOT_SYNDICATED}`);
}

function getSyndicatableItemIDs (items) {
	// Save time by sending only distinct content IDs
	let IDs = Array.from(items).reduce((acc, el) => {
		let ID = getContentIDFromHTMLElement(el);

		if (ID) {
			acc[ID] = ID;
		}

		return acc;
	}, {});

	return Object.keys(IDs);
}

function syndicate () {
	const ELEMENTS = getSyndicatableItems();

	const ITEM_IDS = getSyndicatableItemIDs(ELEMENTS);

	return fetchItems(ITEM_IDS);
}

function syndicateElement (item, el) {
	const element = findElementToSyndicate(el);

	if (element !== null && element.getAttribute(ATTR_SYNDICATED) !== 'true') {
		element.classList.add(CSS_CLASS_PREFIX);
		element.classList.add(`${CSS_CLASS_PREFIX}-state-${item.canBeSyndicated}`);

		element.prepend(createElement(item));

		element.setAttribute(ATTR_CONTENT_TYPE, item.type);
	}

	if (element !== el) {
		el.setAttribute(ATTR_CONTENT_TYPE, item.type);
		el.setAttribute(ATTR_SYNDICATED, 'true');
	}
}

function syndicateElements (item, els) {
	if (!els.length) {
		return;
	}

	els.forEach(el => syndicateElement(item, el));
}

function updatePage (els) {
	if (!Array.isArray(els)) {
		els = getSyndicatableItems();
	}

	const elementsByContentID = Array.from(els).reduce((acc, el) => {
		const contentID = el.getAttribute(ATTR_CONTENT_ID);

		if (!Array.isArray(acc[contentID])) {
			acc[contentID] = [];
		}

		acc[contentID].push(el);

		return acc;
	}, {});

	DATA_STORE.forEach(item => syndicateElements(item, elementsByContentID[item[DATA_ID_PROPERTY]]));

	broadcast(`${EVENT_PREFIX}.iconified`);
}

export {
	createElement,
	findElementToSyndicate,
	getSyndicatableItems,
	getSyndicatableItemIDs,
	init,
	syndicate,
	syndicateElement,
	syndicateElements,
	updatePage
};
