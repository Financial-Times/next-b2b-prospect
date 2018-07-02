process.env.MARKETO_REST_ENDPOINT = 'test';
process.env.MARKETO_IDENTITY_ENDPOINT = 'test';
process.env.MARKETO_CLIENT_ID = 'test';
process.env.MARKETO_CLIENT_SECRET = 'test';

import sinon from 'sinon';
import request from 'supertest';
import { expect } from 'chai';
import app, { ready } from '../../../../server/app';

import raven from '@financial-times/n-raven';
import Marketo from '../../../../server/modules/marketo/service';
import Profile from '../../../../server/modules/profile/service';
import Cache from '../../../../server/modules/encoding/service';
import ContentAccess from '../../../../server/modules/content/service';
import ES from '../../../../server/modules/es/service';

describe('Form', () => {

	before(() => ready);

	describe('GET /form', () => {

		it('should render a contact form', (done) => {
			request(app)
				.get('/form')
				.expect(200)
				.end((err, res) => {
					expect(res.headers['cache-control']).to.equal('max-age=0, no-cache, must-revalidate');
					expect(res.headers['surrogate-control']).to.equal('max-age=3600, stale-while-revalidate=60, stale-if-error=86400');
					expect(res.text).to.contain('<form');
					expect(res.text).to.contain('First name');
					expect(res.text).to.contain('Last name');
					expect(res.text).to.contain('Job title');
					expect(res.text).to.contain('Company name');
					expect(res.text).to.contain('Work email address');
					expect(res.text).to.contain('Work phone number');
					expect(res.text).to.contain('Terms and conditions');
					expect(res.text).to.contain('type="submit"');
					done();
				});
		});

		it('should customise form for factiva', (done) => {
			request(app)
				.get('/form?marketingName=factiva')
				.expect(200)
				.end((err, res) => {
					expect(res.headers['cache-control']).to.equal('max-age=0, no-cache, must-revalidate');
					expect(res.headers['surrogate-control']).to.equal('max-age=3600, stale-while-revalidate=60, stale-if-error=86400');
					expect(res.text).to.contain('Contact us for FT Group Subscription options');
					expect(res.text).to.contain('<form');
					expect(res.text).to.contain('First name');
					expect(res.text).to.contain('Last name');
					expect(res.text).to.contain('Job title');
					expect(res.text).to.contain('Company name');
					expect(res.text).to.contain('Work email address');
					expect(res.text).to.contain('Work phone number');
					expect(res.text).to.contain('Terms and conditions');
					expect(res.text).to.contain('type="submit"');
					done();
			});
		});

		it('should customise form for unmasking theme', (done) => {
			request(app)
				.get('/form?marketingName=unmasking')
				.expect(200)
				.end((err, res) => {
					expect(res.headers['cache-control']).to.equal('max-age=0, no-cache, must-revalidate');
					expect(res.headers['surrogate-control']).to.equal('max-age=3600, stale-while-revalidate=60, stale-if-error=86400');
					expect(res.text).to.contain('<form');
					expect(res.text).to.contain('First name');
					expect(res.text).to.contain('Last name');
					expect(res.text).to.contain('Job title');
					expect(res.text).to.contain('Company name');
					expect(res.text).to.not.contain('Work email address');
					expect(res.text).to.contain('Work phone number');
					expect(res.text).to.contain('Terms and conditions');
					expect(res.text).to.contain('type="submit"');
					expect(res.text).to.contain('<div class="o-forms-section">');
					done();
			});
		});

	});

	describe('POST /form', () => {

		const mockAccessToken = 'heyhoaccessforyo';
		const mockCacheToken = 'gottacachethemall';
		const mockMarketoCreatedResponse = { id: 'test', status: 'created' };
		const mockMarketoUpdatedResponse = { id: 'test', status: 'updated' };
		let sandbox;
		let marketoStub;
		let profileStub;
		let accessStub;
		let cacheEncodeStub;
		let ravenStub;
		let testPayload;

		beforeEach(() => {
			sandbox = sinon.createSandbox();
			marketoStub = sandbox.stub(Marketo, 'createOrUpdate').returns(Promise.resolve(mockMarketoCreatedResponse));
			profileStub = sandbox.stub(Profile, 'save').resolves();
			accessStub = sandbox.stub(ContentAccess, 'createAccessToken').returns(Promise.resolve({ accessToken: mockAccessToken }));
			cacheEncodeStub = sandbox.stub(Cache, 'encode').returns(mockCacheToken);
			ravenStub = sandbox.stub(raven, 'captureError');
			testPayload = {
				firstName: 'test',
				lastName: 'test',
				company: 'test'
			};
		});

		afterEach(() => {
			sandbox.restore();
		});

		it('should redirect to the form if invalid payload submitted', (done) => {
			request(app)
				.post('/form')
				.expect(302)
				.expect('Location', '/form')
				.end(done);
		});

		it('should render a confirmation page if acceptable payload submitted', (done) => {

			request(app)
				.post('/form')
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.send(testPayload)
				.expect(200)
				.end((err, res) => {

					expect(marketoStub.calledOnce).to.equal(true);
					expect(marketoStub.calledWithMatch(testPayload)).to.equal(true);

					expectConfirmationPage(res);
					done();
				});
		});

		it('should call Profile if marketingName is unmasking', (done) => {
			request(app)
				.post('/form?marketingName=unmasking')
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.send(testPayload)
				.expect(200)
				.end((err, res) => {

					expect(profileStub.calledOnce).to.equal(true);

					expectConfirmationPage(res);
					done();
				});
		});

		it('should create an access token if content-uuid specified', (done) => {
			const mockUuid = 'test';

			request(app)
				.post(`/form?ft-content-uuid=${mockUuid}`)
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.send(testPayload)
				.expect(200)
				.end((err, res) => {

					expect(accessStub.calledOnce).to.equal(true);
					expect(accessStub.calledWith({ uuid: mockUuid })).to.equal(true);

					expectConfirmationPage(res);
					done();
				});

		});

		it('should create a cache cookie if an access token was created', (done) => {
			const mockUuid = 'test';
			request(app)
				.post(`/form?ft-content-uuid=${mockUuid}&marketingName=foo`)
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.send(testPayload)
				.expect(200)
				.end((err, res) => {
					expect(res.headers['set-cookie'][0]).to.match(new RegExp(`PROSPECT_SUBMISSION=${mockCacheToken}`));
					expect(cacheEncodeStub.calledOnce).to.equal(true);
					expect(cacheEncodeStub.calledWith({
						leadId: mockMarketoCreatedResponse.id,
						marketingName: 'foo',
						contentUuid: mockUuid,
						accessToken: mockAccessToken
					})).to.equal(true);

					expectConfirmationPage(res);

					done();
				});
		});

		it('should clear barrier logic cookies after successful submission', (done) => {
			const mockUuid = 'test';

			request(app)
				.post(`/form?ft-content-uuid=${mockUuid}&marketingName=foo`)
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.send(testPayload)
				.expect(200)
				.end((err, res) => {
					expect(res.headers['set-cookie'][1]).to.equal('FTBarrierAcqCtxRef=; Domain=.ft.com; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
					expect(res.headers['set-cookie'][2]).to.equal('FTBarrier=; Domain=.ft.com; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
					expectConfirmationPage(res);
					done();
				});

		});

		it('should always notify sentry in a non-happy path journey', (done) => {

			marketoStub.returns(Promise.reject('test'));

			request(app)
				.post('/form')
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.send(testPayload)
				.end((err, res) => {
					expect(ravenStub.calledOnce).to.equal(true);
					expect(ravenStub.calledWith('test')).to.equal(true);
					done();
				});
		});

		context('when user already exists', () => {

			beforeEach(() => {
				marketoStub.resolves(mockMarketoUpdatedResponse);
			});

			it('should display a page indicating the user already exists', (done) => {

				request(app)
					.post('/form')
					.set('Content-Type', 'application/x-www-form-urlencoded')
					.send(testPayload)
					.end((err, res) => {
						expect(res.text).to.contain('you have already submitted an enquiry');
						done();
					});
			});

		});

		context('when an unexpected error occurs', () => {

			beforeEach(() => {
				marketoStub.returns(Promise.reject({
					type: 'anything_else'
				}));
			});

			it('should display an error page', (done) => {
				request(app)
					.post('/form')
					.set('Content-Type', 'application/x-www-form-urlencoded')
					.send(testPayload)
					.end((err, res) => {
						expect(res.text).to.contain('Oops! Something went wrong.');
						done();
					});
			});

		});

	});

	describe('GET /form/confirm', () => {

		const mockCacheItem = {
			leadId: 'test',
			contentUuid: 'mock-uuid',
			accessToken: 'mock-access-token'
		};
		const mockContentItem = {
			id: 'test-content-id',
			title: 'Unit tests are the best'
		};
		let sandbox;
		let cacheDecodeStub;
		let esStub;

		beforeEach(() => {
			sandbox = sinon.createSandbox();
			cacheDecodeStub = sandbox.stub(Cache, 'decode').returns(mockCacheItem);
			esStub = sandbox.stub(ES, 'get').returns(Promise.resolve(mockContentItem));
		});

		afterEach(() => {
			sandbox.restore();
		});

		context('when no submission cookie specified', () => {
			it('should redirect to FT.com', done => {
				request(app)
					.get('/form/confirm')
					.expect(303)
					.expect('Location', 'http://ft.com')
					.end(done);
			});
		});

		context('when submission cookie not valid', () => {

			it('should redirect to FT.com', done => {
				cacheDecodeStub.returns(null);
				request(app)
					.get('/form/confirm')
					.set('Cookie', ['PROSPECT_SUBMISSION=something-invalid'])
					.expect(303)
					.expect('Location', 'http://ft.com')
					.end(done);
			});

		});

		context('when submission token is valid', () => {

			it('should retrieve content data from ES', done => {

				const mockCacheKey = 'some-unique-key';

				request(app)
					.get(`/form/confirm`)
					.set('Cookie', [`PROSPECT_SUBMISSION=${mockCacheKey}`])
					.expect(200)
					.end((err, res) => {
						expect(cacheDecodeStub.calledWith(mockCacheKey)).to.eq(true);
						expect(esStub.calledWith(mockCacheItem.contentUuid)).to.eq(true);

						expect(res.text).to.contain(mockContentItem.title);
						done();
					});
			});

			it('should track lead and article IDs', done => {
				request(app)
					.get(`/form/confirm`)
					.set('Cookie', [`PROSPECT_SUBMISSION=valid-hash`])
					.expect(200)
					.end((err, res) => {
						expect(res.text).to.contain(`data-lead-id="${mockCacheItem.leadId}"`);
						expect(res.text).to.contain(`data-article-id="${mockContentItem.id}"`);
						done();
					});
			});

		});

	})

});

function expectConfirmationPage(response) {
	expect(response.text).to.contain('Thank you for your enquiry');
	expect(response.text).to.contain('A sales representative will get back to you about FT Group subscriptions within 48 hours.');
	expect(response.text).to.contain('Give us a call');
	expect(response.text).to.contain('UK +44 (0)20 7873 4001');
	expect(response.text).to.contain('US (toll free) +1 1877 843 3399');
	expect(response.text).to.contain('Asia +632 982 5780');
}
