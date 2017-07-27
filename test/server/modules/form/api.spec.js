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

describe('Form', () => {

	before(() => ready);

	describe('GET', () => {
		it('should render a contact form', (done) => {
			request(app)
				.get('/form')
				.expect(200)
				.end((err, res) => {
					expect(res.headers['cache-control']).to.equal('max-age=3600, stale-while-revalidate=60, stale-if-error=86400');
					expect(res.text).to.contain('<form method="POST"');
					expect(res.text).to.contain('First name');
					expect(res.text).to.contain('Last name');
					expect(res.text).to.contain('Job title');
					expect(res.text).to.contain('Company name');
					expect(res.text).to.contain('Work email address');
					expect(res.text).to.contain('Phone number');
					expect(res.text).to.contain('Terms and conditions');
					expect(res.text).to.contain('type="submit"');
					done();
				});
		});
	});

	describe('POST', () => {

		let sandbox;
		let marketoStub;
		let ravenStub;

		beforeEach(() => {
			sandbox = sinon.sandbox.create();
			marketoStub = sandbox.stub(Marketo, 'createOrUpdate').returns(Promise.resolve());
			ravenStub = sandbox.stub(raven, 'captureError');
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

			const testPayload = {
				firstName: 'test',
				lastName: 'test',
				company: 'test'
			};

			request(app)
				.post('/form')
				.send(testPayload)
				.expect(200)
				.end((err, res) => {

					expect(marketoStub.calledOnce).to.equal(true);
					expect(marketoStub.calledWith(testPayload)).to.equal(true);

					expectConfirmationPage(res);
					done();
				});
		});

		it('should still render the confirmation page if marketo fails but notify sentry', (done) => {

			const testPayload = {
				firstName: 'test',
				lastName: 'test',
				company: 'test'
			};

			marketoStub.returns(Promise.reject('test'));

			request(app)
				.post('/form')
				.send(testPayload)
				.expect(200)
				.end((err, res) => {

					expect(ravenStub.calledOnce).to.equal(true);
					expect(ravenStub.calledWith('test')).to.equal(true);

					expectConfirmationPage(res);
					done();
				});
		});
	});

});

function expectConfirmationPage(response) {
	expect(response.text).to.contain('Thank you for your enquiry');
	expect(response.text).to.contain('A sales representative will get back to you about FT Group subscriptions within 48 hours.');
	expect(response.text).to.contain('Give us a call');
	expect(response.text).to.contain('UK +44 (0)20 7873 4001');
	expect(response.text).to.contain('US (toll free) +1 1877 843 3399');
	expect(response.text).to.contain('Asia +632 982 5780');
}
