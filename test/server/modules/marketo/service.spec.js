import sinon from 'sinon';
import { expect } from 'chai';
import proxyquire from 'proxyquire';

import * as constants from '../../../../server/modules/marketo/constants';

import Marketo from 'node-marketo-rest';

describe('Marketo Service', () => {

	describe('createOrUpdate', () => {

		const sandbox = sinon.createSandbox();
		const mockResponse = {
			result: [
				{
					status: 'created'
				}
			]
		};
		let service;
		let createLeadStub;

		beforeEach(() => {
			createLeadStub = sandbox.stub().resolves(mockResponse);
			service = proxyquire('../../../../server/modules/marketo/service', {
				'node-marketo-rest': createMarketoMock(createLeadStub)
			});

		});

		afterEach(() => {
			sandbox.restore();
		});

		it('should pass correct parameters to marketo client', () => {
			const param = 'test';
			return service.createOrUpdate(param)
				.then(() => {
					const args = createLeadStub.getCall(0).args;
					// First argument should be an array of the payload
					expect(args[0]).to.deep.equal([param]);
					// Second
					expect(args[1]).to.deep.equal({ lookupField: 'email' });
				});
		});

		context('when lead created successfully', () => {

			it('should resolve with the first result', () => {
				return service.createOrUpdate()
					.then((res) => {
						expect(res).to.deep.equal(mockResponse.result[0]);
					});
			});

		});

		context('when no results returned', () => {

			beforeEach(() => {
				createLeadStub.resolves({result: []});
			});

			it('should reject with a "No results returned error"', () => {
				return service.createOrUpdate()
					.catch((err) => {
						expect(err.type).to.equal(constants.NOT_FOUND_ERROR);
					});
			});

		});

		context('when multiple results returned', () => {

			beforeEach(() => {
				createLeadStub.resolves({result: [1,2,3,4]});
			});

			it('should reject with a "Unexpected result returned - multiple results"', () => {
				return service.createOrUpdate()
					.catch((err) => {
						expect(err.type).to.equal(constants.UNEXPECTED_RESULT_ERROR);
					});
			});

		});

		context('when first result is skipped', () => {

			beforeEach(() => {
				createLeadStub.resolves({result: [{status: 'skipped'}]});
			});

			it('should reject with a "LEAD_ALREADY_EXISTS_ERROR"', () => {
				return service.createOrUpdate()
					.catch((err) => {
						expect(err.type).to.equal(constants.LEAD_ALREADY_EXISTS_ERROR);
					});
			});

		});

		context('when first result is anything other than created', () => {

			beforeEach(() => {
				createLeadStub.resolves({result: [{status: 'unknown'}]});
			});

			it('should reject with a "UNEXPECTED_RESULT_ERROR"', () => {
				return service.createOrUpdate()
					.catch((err) => {
						expect(err.type).to.equal(constants.UNEXPECTED_RESULT_ERROR);
					});
			});

		});

	});

});

const createMarketoMock = stub => class MockMarketo {
	constructor() {
		return {
			lead: {
				createOrUpdate: stub
			}
		}
	}
}
