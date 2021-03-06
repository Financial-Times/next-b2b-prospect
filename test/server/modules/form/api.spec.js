process.env.MARKETO_REST_ENDPOINT = 'test';
process.env.MARKETO_IDENTITY_ENDPOINT = 'test';
process.env.MARKETO_CLIENT_ID = 'test';
process.env.MARKETO_CLIENT_SECRET = 'test';

import sinon from 'sinon';
import request from 'supertest';
import { expect } from 'chai';
import app, { ready } from '../../../../server/server';
import nock from 'nock';
import SuperTester from 'supertest-parse';

import raven from '@financial-times/n-raven';
import Marketo from '../../../../server/modules/marketo/service';
import Profile from '../../../../server/modules/profile/service';
import Cache from '../../../../server/modules/encoding/service';
import ContentAccess from '../../../../server/modules/content/service';
import ES from '../../../../server/modules/es/service';

describe('Form', () => {

	before(() => ready);

	describe('GET /form', () => {

		let tester;

		before(() => {
			tester = new SuperTester({ app });
		});

		it('should render a contact form', () => {

			return tester.get({ path: '/form' })
				.then(({ status, headers, $ }) => {
					expect(status).to.equal(200);
					expect(headers['cache-control']).to.equal('max-age=0, no-cache, must-revalidate');
					expect(headers['surrogate-control']).to.equal('max-age=0, no-cache, must-revalidate');

					expect($('header#site-navigation').length).to.equal(0);
					expect($('footer#site-footer').length).to.equal(0);

					expect($('form').length).to.equal(1);
					expect($('label#firstNameField .o-forms-title__main').text().trim()).to.equal('First name');
					expect($('label#lastNameField .o-forms-title__main').text().trim()).to.equal('Last name');
					expect($('label#jobTitleField .o-forms-title__main').text().trim()).to.equal('Job title');
					expect($('label#companyNameField .o-forms-title__main').text().trim()).to.equal('Company name');
					expect($('label#emailField .o-forms-title__main').text().trim()).to.equal('Work email address');
					expect($('label#primaryTelephoneField .o-forms-title__main').text().trim()).to.equal('Work phone number');
					expect($('label#countryField .o-forms-title__main').text().trim()).to.equal('Country');
					expect($('button[type="submit"]').length).to.equal(1);

				});

		});

		it('should customise form for factiva', () => {
			return tester.get({ path: '/form/factiva' })
				.then(({ status, headers, $ }) => {
					expect(status).to.equal(200);
					expect(headers['cache-control']).to.equal('max-age=0, no-cache, must-revalidate');
					expect(headers['surrogate-control']).to.equal('max-age=0, no-cache, must-revalidate');

					expect($('header#site-navigation').length).to.equal(0);
					expect($('footer#site-footer').length).to.equal(0);

					expect($('.prospect-form__heading').text()).to.contain('Contact us for FT Group Subscription options');
					expect($('form').length).to.equal(1);
					expect($('label#firstNameField .o-forms-title__main').text().trim()).to.equal('First name');
					expect($('label#lastNameField .o-forms-title__main').text().trim()).to.equal('Last name');
					expect($('label#jobTitleField .o-forms-title__main').text().trim()).to.equal('Job title');
					expect($('label#companyNameField .o-forms-title__main').text().trim()).to.equal('Company name');
					expect($('label#emailField .o-forms-title__main').text().trim()).to.equal('Work email address');
					expect($('label#primaryTelephoneField .o-forms-title__main').text().trim()).to.equal('Work phone number');
					expect($('label#countryField .o-forms-title__main').text().trim()).to.equal('Country');
					expect($('button[type="submit"]').length).to.equal(1);
				});
		});

		it('should customise form for unmasking theme', () => {
			return tester.get({ path: '/form/unmasking' })
				.then(({ status, headers, $ }) => {
					expect(status).to.equal(200);
					expect(headers['cache-control']).to.equal('max-age=0, no-cache, must-revalidate');
					expect(headers['surrogate-control']).to.equal('max-age=0, no-cache, must-revalidate');

					expect($('header#site-navigation').length).to.equal(0);
					expect($('footer#site-footer').length).to.equal(0);

					expect($('form').length).to.equal(1);
					expect($('label#firstNameField .o-forms-title__main').text().trim()).to.equal('First name');
					expect($('label#lastNameField .o-forms-title__main').text().trim()).to.equal('Last name');
					expect($('label#jobTitleField .o-forms-title__main').text().trim()).to.equal('Job title');
					expect($('label#companyNameField .o-forms-title__main').text().trim()).to.equal('Company name');
					expect($('label#emailField .o-forms-title__main').text().trim()).to.equal('Work email address');
					expect($('label#primaryTelephoneField .o-forms-title__main').text().trim()).to.equal('Work phone number');
					expect($('label#countryField .o-forms-title__main').text().trim()).to.equal('Country');
					expect($('button[type="submit"]').length).to.equal(1);

					expect($('.o-forms-section').text()).to.contain('Or speak to a product specialist immediately');
				});
		});

		it('should customise form for teamtrial theme', () => {
			return tester.get({ path: '/form/teamtrial' })
				.then(({ status, headers, $ }) => {
					expect(status).to.equal(200);
					expect(headers['cache-control']).to.equal('max-age=0, no-cache, must-revalidate');
					expect(headers['surrogate-control']).to.equal('max-age=0, no-cache, must-revalidate');

					expect($('header#site-navigation').length).to.equal(1);
					expect($('footer#site-footer').length).to.equal(1);

					expect($('form').length).to.equal(1);
					expect($('label#firstNameField .o-forms-title__main').text().trim()).to.equal('First name');
					expect($('label#lastNameField .o-forms-title__main').text().trim()).to.equal('Last name');
					expect($('label#jobTitleField .o-forms-title__main').text().trim()).to.equal('Job title');
					expect($('label#companyNameField .o-forms-title__main').text().trim()).to.equal('Company name');
					expect($('label#emailField .o-forms-title__main').text().trim()).to.equal('Work email address');
					expect($('label#primaryTelephoneField .o-forms-title__main').text().trim()).to.equal('Work phone number');
					expect($('label#countryField .o-forms-title__main').text().trim()).to.equal('Country');
					expect($('button[type="submit"]').length).to.equal(1);

					expect($('.o-forms-section').text()).to.contain('Or speak to a product specialist immediately');
				});
		});

		it('should render consent fields if the form of words can be retrieved', done => {
			nock(process.env.FOW_API_HOST)
				.get('/api/v1/FTPINK/consentB2BProspect')
				.reply(200, {
					consents: [
						{
							category: 'enhancement',
							channels: [
								{ channel: 'byEmail' }
							]
						}
					]
				});

			request(app)
				.get('/form?marketingName=factiva')
				.end((err, res) => {
					expect(res.text).to.contain('<div class="consent-form');
					done();
				});
		});

		it('should render the legacy terms and conditions section if form of words cannot be retrieved', done => {
			nock(process.env.FOW_API_HOST)
				.get('/api/v1/FTPINK/consentB2BProspect')
				.reply(404);

			request(app)
				.get('/form?marketingName=factiva')
				.end((err, res) => {
					expect(res.text).to.not.contain('<div class="consent-form');
					expect(res.text).to.contain('<input type="checkbox" id="termsAcceptance');
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
			marketoStub = sandbox.stub(Marketo, 'createOrUpdate').resolves(mockMarketoCreatedResponse);
			profileStub = sandbox.stub(Profile, 'save').resolves();
			accessStub = sandbox.stub(ContentAccess, 'createAccessToken').resolves({ accessToken: mockAccessToken });
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

		it('should call Profile if marketingName is teamtrial', (done) => {
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
			const testError = new Error('test');
			marketoStub.rejects(testError);

			request(app)
				.post('/form')
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.send(testPayload)
				.end((err, res) => {
					expect(ravenStub.calledOnce).to.equal(true);
					expect(ravenStub.calledWith(testError)).to.equal(true);
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
				marketoStub.rejects({
					type: 'anything_else'
				});
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

		it('should correctly map consent fields to Marketo fields', (done) => {
			const payload = Object.assign({}, testPayload, {
				formOfWordsId: 'test-fow-id',
				formOfWordsScope: 'test-fow-scope',
				consentSource: 'next-b2b-prospect',
				'lbi-enhancement-byEmail': 'yes',
				'lbi-enhancement-byPost': 'no'
			});

			const expectedPayload = Object.assign({}, testPayload, {
				'Consent_enhancement_byEmail': true,
				'Consent_enhancement_byPost': false
			});

			request(app)
				.post('/form')
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.set('FT-Flags', 'channelsBarrierConsent:on')
				.send(payload)
				.expect(200)
				.end((err, res) => {
					expect(marketoStub.calledOnce).to.equal(true);
					expect(marketoStub.calledWithMatch(expectedPayload)).to.equal(true);

					expectConfirmationPage(res);
					done();
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
			esStub = sandbox.stub(ES, 'get').resolves(mockContentItem);
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
