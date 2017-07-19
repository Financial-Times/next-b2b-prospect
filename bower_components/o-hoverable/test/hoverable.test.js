/*global describe, afterEach, it*/

import proclaim from 'proclaim';
const Hoverable = require('./../main.js');

describe('o-hoverable', function() {

	let testHoverable;

	afterEach(function() {
		testHoverable.destroy();
	});

	it('should initialise the module', function() {
		proclaim.isFalse(window.document.documentElement.hasAttribute('data-o-hoverable--js'));
		testHoverable = new Hoverable();
		proclaim.isTrue(window.document.documentElement.hasAttribute('data-o-hoverable--js'));
	});

	it('should destroy the module', function() {
		proclaim.isFalse(window.document.documentElement.hasAttribute('data-o-hoverable--js'));
		testHoverable = new Hoverable();
		proclaim.isTrue(window.document.documentElement.hasAttribute('data-o-hoverable--js'));
		testHoverable.destroy();
		proclaim.isFalse(window.document.documentElement.hasAttribute('data-o-hoverable--js'));
	});

	it('should initialise the module by emitting the o.DOMContentLoaded event', function() {
		proclaim.isFalse(window.document.documentElement.hasAttribute('data-o-hoverable--js'));
		document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
		proclaim.isTrue(window.document.documentElement.hasAttribute('data-o-hoverable--js'));
	});

	it('should check if class o-hoverable-on is set on <html>', function() {
		testHoverable = new Hoverable();
		proclaim.isFalse(testHoverable.isHoverEnabled());
		window.document.documentElement.classList.add('o-hoverable-on');
		proclaim.isTrue(testHoverable.isHoverEnabled());
	});

	it('should set custom class on <html>', function() {
		testHoverable = new Hoverable();
		testHoverable.setClassName('hover-test');
		proclaim.isFalse(testHoverable.isHoverEnabled());
		window.document.documentElement.classList.add('hover-test');
		proclaim.isTrue(testHoverable.isHoverEnabled());
	});

});
