import sinon from 'sinon';
import { expect } from 'chai';
const fetchres = require('fetchres');

import AccessService from '../../../../server/modules/content/service'

describe('Content Access Service', () => {

	const sandbox = sinon.createSandbox();
	const mockProcessVar = 'test';
	const mockResponse = '{}';
	let fetchStub;
	let parseStub;

	beforeEach(() => {
		sandbox.useFakeTimers();
		process.env.CONTENT_ACCESS_TOKEN_SVC_URL = mockProcessVar;
		process.env.CONTENT_ACCESS_TOKEN_SVC_KEY = mockProcessVar;
		fetchStub = sandbox.stub().resolves(mockResponse);
		parseStub = sandbox.stub(fetchres, 'json');
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('createAccessToken', () => {

		it('should fetch the CONTENT_ACCESS_TOKEN_SVC_URL with path', () => {
			return AccessService.createAccessToken({
				uuid: 'test',
				fetch: fetchStub
			}).then(() => {
				expect(fetchStub.calledWith(`${mockProcessVar}/sign`))
			});
		});

		it('should set the method and headers', () => {
			return AccessService.createAccessToken({
				uuid: 'test',
				fetch: fetchStub
			}).then(() => {

				const [url, options] = fetchStub.getCall(0).args;

				expect(options.method).to.eq('POST');
				expect(options.headers).to.have.property('Content-Type', 'application/json');
				expect(options.headers).to.have.property('x-api-key', mockProcessVar);

			});
		});

		it('should format the body and set the expiryTime to 60 minutes time', () => {
			return AccessService.createAccessToken({
				uuid: 'test',
				fetch: fetchStub
			}).then(() => {
				const [url, options] = fetchStub.getCall(0).args;

				expect(options).to.have.property('body');
				const body = JSON.parse(options.body);

				expect(body).to.have.deep.property('contentUUIDs', ['test']);
				expect(body).to.have.property('expiryTime');

				expect(new Date(body.expiryTime).getTime()).to.eq(Date.now() + (60 * (60*1000)));

			});
		});

		it('should parse the result as JSON', () => {

			return AccessService.createAccessToken({
				uuid: 'test',
				fetch: fetchStub
			}).then(() => {
				expect(parseStub.calledOnce).to.eq(true);
				expect(parseStub.calledWith(mockResponse)).to.eq(true);
			});

		});

	});

});
