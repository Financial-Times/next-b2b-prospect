const dom = require('o-dom');

module.exports = {
	getLayerContext: function (el) {
		return dom.getClosestMatch(el, '.o-layers__context') || document.body;
	}
};
