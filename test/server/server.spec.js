import sinon from 'sinon';
import request from 'supertest';
import { expect } from 'chai';
import app, { ready } from '../../server/server';

describe('App', () => {

	before(() => ready);

	describe('non-registered routes ', () => {

		it('should redirect to FT.com', (done) => {
			const fakePath = '/non-existant-endpoint';
			request(app)
				.get(fakePath)
				.expect(302)
				.expect('Location', `https://ft.com${fakePath}`)
				.end(done);
		});

	});

});
