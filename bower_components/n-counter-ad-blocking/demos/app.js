'use strict';

const express = require('@financial-times/n-express');
const fixtures = require('./fixtures.json');
const overlayHTML = require('../src/html/overlay-html');
const bannerHTML = require('../src/html/banner-html');
const chalk = require('chalk');
const errorHighlight = chalk.bold.red;
const highlight = chalk.bold.green;

const app = module.exports = express({
	name: 'public',
	withAssets: true,
	withFlags: false,
	withHandlebars: true,
	withNavigation: false,
	withAnonMiddleware: false,
	hasHeadCss: false,
	viewsDirectory: '/demos/views',
	partialsDirectory: process.cwd(),
	directory: process.cwd()
});

app.get('/no-close-overlay', (req, res) => {
	res.render('no-close-overlay', {
		title: 'Test App'
	});
});

app.get('/no-close-overlay-button', (req, res) => {
	res.render('no-close-overlay-button', {
		title: 'Test App'
	});
});

app.get('/overlay-pa11y', (req, res) => {
	res.render('overlay-pa11y', {
		title: 'Test App',
		overlayHTML
	});
});

app.get('/banner-pa11y', (req, res) => {
	res.render('banner-pa11y', {
		title: 'Test App',
		bannerHTML
	});
});

app.get('/close-banner', (req, res) => {
	res.render('close-banner', {
		title: 'Test App'
	});
});

app.get('/close-banner-button', (req, res) => {
	res.render('close-banner-button', {
		title: 'Test App'
	});
});

app.get('/', (req, res) => {
	res.render('demo', Object.assign({
		title: 'Test App'
	}, fixtures.demo));
});

function runPa11yTests () {
	const spawn = require('child_process').spawn;
	const pa11y = spawn('pa11y-ci');

	pa11y.stdout.on('data', (data) => {
		console.log(highlight(`${data}`)); //eslint-disable-line
	});

	pa11y.stderr.on('data', (error) => {
		console.log(errorHighlight(`${error}`)); //eslint-disable-line
	});

	pa11y.on('close', (code) => {
		process.exit(code);
	});
}

const listen = app.listen(5005);

if (process.env.PA11Y === 'true') {
	listen.then(runPa11yTests);
}
