'use strict';

const nWebpack = require('@financial-times/n-webpack');

module.exports = nWebpack({
	entry:  {
		'./public/main.js': './demos/client/demo.js'
	},
	exclude: [/node_modules/],
	includes: [/src/, /main.js/]
});
