process.env.MARKETO_REST_ENDPOINT = 'test';
process.env.MARKETO_IDENTITY_ENDPOINT = 'test';
process.env.MARKETO_CLIENT_ID = 'test';
process.env.MARKETO_CLIENT_SECRET = 'test';

import sinon from 'sinon';
import request from 'supertest';
import { expect } from 'chai';
import app, { ready } from '../../../../server/app';
import Marketo from '../../../../server/modules/marketo/service';
import raven from '@financial-times/n-raven';

describe('API Endpoints', () => {
    
    before(() => ready);

    describe('Marketo', () => {
        
        let sandbox;
        let marketoStub;
        let ravenStub;
        const acceptablePayload = {
            "firstName": "Test",
            "lastName": "User",
            "title": "Mr",
            "company": "FT",
            "email": "test@test.com",
            "phone": "07123456789",
            "country": "test",
            "rating": "test"
        }
        const mockMarketoResponse = {
            id: 'something',
            status: 'created'
        };

        beforeEach(() => {
            sandbox = sinon.sandbox.create();
            marketoStub = sandbox.stub(Marketo, 'createOrUpdate').resolves(mockMarketoResponse);
            ravenStub = sandbox.stub(raven, 'captureError');
        });

        afterEach(() => {
            sandbox.restore();
        });

        context('when invalid payload submitted', () => {

            it('should return a 400 status and error details', () => {
                request(app)
                    .post('/api/marketo')
                    .end((err, res) => {
                        expect(res.status).to.equal(400);
                        expect(res.body).to.have.property('error');
                        expect(res.body).to.have.property('errors');
                    });
            });

        });

        context('when submitted successfully', () => {

            it('should return a 200 status and details of the inserted user', () => {
                request(app)
                    .post('/api/marketo')
                    .send(acceptablePayload)
                    .end((err, res) => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property('details');
                        expect(res.body.details).to.contain(Object.assign(mockMarketoResponse, acceptablePayload));
                    });
            });

        });

        context('when a marketo error happens', () => {

            beforeEach(() => {
                Marketo.createOrUpdate.rejects({});                
            });

            it('should return a 500 status and error details', () => {
                request(app)
                    .post('/api/marketo')
                    .send(acceptablePayload)
                    .end((err, res) => {
                        expect(res.status).to.equal(500);
                        expect(res.body).to.have.property('error', 'MarketoError');
                    });
            });

        });

    });

});
