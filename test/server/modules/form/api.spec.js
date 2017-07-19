import request from 'supertest';
import { expect } from 'chai';
import app from '../../../../server/app';

describe('Form', () => {

	describe('GET', () => {
		it('should render a contact form', (done) => {
			request(app)
				.get('/form')
				.expect(200)
				.end((err, res) => {
					expect(res.text).to.contain('<form method="POST">');
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
		it('should render a confirmation page', (done) => {
			request(app)
				.post('/form')
				.expect(200)
				.end((err, res) => {
					expect(res.text).to.contain('Thank you for your enquiry');
					expect(res.text).to.contain('A sales representative will get back to you about FT Group subscriptions within 48 hours.');
					expect(res.text).to.contain('Give us a call');
					expect(res.text).to.contain('UK +44 (0)20 7873 4001');
					expect(res.text).to.contain('US (toll free) +1 1877 843 3399');
					expect(res.text).to.contain('Asia +632 982 5780');
					done();
				});
		});
	});

});
