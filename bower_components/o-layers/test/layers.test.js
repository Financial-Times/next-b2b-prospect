/*global describe, it*/

const expect = require('expect.js');

const oLayers = require('./../main.js');

describe('o-layers', function() {

	it('#getLayerContext', function() {
		const pElement = document.createElement('p');
		document.body.appendChild(pElement);
		expect(oLayers.getLayerContext(pElement)).to.be(document.body);
		const divElement = document.createElement('div');
		divElement.classList.add('o-layers__context');
		divElement.appendChild(pElement);
		document.body.appendChild(divElement);
		expect(oLayers.getLayerContext(pElement)).to.be(divElement);
	});
});
