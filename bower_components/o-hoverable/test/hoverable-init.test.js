/* eslint-env mocha, sinon, proclaim */
import proclaim from 'proclaim';
import sinon from 'sinon/pkg/sinon';

const Hoverable = require('./../main.js');

describe("o-hoverable init", () => {

	afterEach(function() {
		const testHoverable = new Hoverable();
		testHoverable.destroy();
	});

	it('is defined', () => {
		proclaim.isFunction(Hoverable);
	});

	it('has a static init method', () => {
		proclaim.isFunction(Hoverable.init);
	});

	it("should autoinitialize", (done) => {
		const autoInitSpy = sinon.spy(Hoverable, 'init');
		document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
		setTimeout(() => {
			proclaim.isTrue(autoInitSpy.called);
			autoInitSpy.restore();
			done();
		}, 100);
	});

	it("should not autoinitialize when the event is not dispached", () => {
		const initSpy = sinon.spy(Hoverable, 'init');
		proclaim.isFalse(initSpy.called);
		initSpy.restore();
	});
});
