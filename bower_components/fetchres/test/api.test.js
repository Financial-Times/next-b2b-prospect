"use strict";

require('es6-promise').polyfill();
require('isomorphic-fetch');
var fetchRes = require('../lib/fetchres');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var nock = require('nock');
var good = 'hello world. 你好世界。';
var bad = 'good bye cruel world. 再见残酷的世界。';

describe('fetch', function() {

	before(function() {
		nock('https://mattandre.ws')
			.get('/succeed.txt')
			.times(3)
			.reply(200, good);
		nock('https://mattandre.ws')
			.get('/fail.txt')
			.reply(410, bad);
		nock('https://mattandre.ws')
			.get('/no.txt')
			.reply(204, '');
		nock('https://mattandre.ws')
			.get('/succeed.json')
			.times(3)
			.reply(200, { text: good });
		nock('https://mattandre.ws')
			.get('/fail.json')
			.reply(404, { text: bad });
		nock('https://mattandre.ws')
			.get('/invalid.json')
			.reply(200, 'that\'s no json');
		nock('https://mattandre.ws')
			.get('/no.json')
			.reply(204, '');
	});

	it('should facilitate the making of requests', function() {
		return fetch('https://mattandre.ws/succeed.txt')
			.then(fetchRes.text)
			.then(function(data) {
				expect(data).to.equal(good);
			});
	});

	it('should do the right thing with bad requests', function() {
		return fetch('https://mattandre.ws/fail.txt')
			.then(fetchRes.text)
			.catch(function(err) {
				expect(err.name).to.equal(fetchRes.BadServerResponseError.name);
				expect(err.message).to.equal('https://mattandre.ws/fail.txt responded with a 410 (Gone)');
			});
	});

	it('should facilitate the making of json requests', function() {
		return fetch('https://mattandre.ws/succeed.json')
			.then(fetchRes.json)
			.then(function(data) {
				expect(data.text).to.equal(good);
			});
	});

	it('should do the right thing with bad json requests', function() {
		return fetch('https://mattandre.ws/fail.json')
			.then(fetchRes.json)
			.catch(function(err) {
				expect(err.name).to.equal(fetchRes.BadServerResponseError.name);
				expect(err.message).to.equal('https://mattandre.ws/fail.json responded with a 404 (Not Found)');
			});
	});

	it('should do the right thing with invalid json responses', function() {
		return fetch('https://mattandre.ws/invalid.json')
			.then(fetchRes.json)
			.catch(function(err) {
				expect(err.name).to.equal(fetchRes.InvalidJsonError.name);
				var isFetchResOriginatedError = fetchRes.originatedError(err);
				expect(isFetchResOriginatedError).to.equal(true);
			});
	});

	it('should do the right thing with contentless json responses', function() {
		return fetch('https://mattandre.ws/no.json')
			.then(fetchRes.json)
			.then(function(json) {
				expect(json).to.equal(undefined);
			});
	});

	it('should facilitate the making of many json requests', function() {
		return Promise.all([
				fetch('https://mattandre.ws/succeed.json'),
				fetch('https://mattandre.ws/succeed.json')
			])
			.then(fetchRes.json)
			.then(function(data) {
				expect(data[0].text).to.equal(good);
				expect(data[1].text).to.equal(good);
			});
	});

	it('should facilitate the making of many txt requests', function() {
		return Promise.all([
				fetch('https://mattandre.ws/succeed.txt'),
				fetch('https://mattandre.ws/succeed.txt')
			])
			.then(fetchRes.text)
			.then(function(data) {
				expect(data[0]).to.equal(good);
				expect(data[1]).to.equal(good);
			});
	});

	it('should do the right thing with contentless text responses', function() {
		return fetch('https://mattandre.ws/no.txt')
			.then(fetchRes.text)
			.then(function(txt) {
				expect(txt).to.equal(undefined);
			});
	});

	it('should throw ReadTimeoutError if json reading times out', function() {
		var response = {
			ok: true,
			json: function() {
				return Promise.reject(new Error('response timeout at...'));
			}
		};
		return expect(fetchRes.json(response)).to.be.rejectedWith(fetchRes.ReadTimeoutError, 'response timeout at...');
	});

});
