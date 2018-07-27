import sinon from 'sinon';
import { expect } from 'chai';
import es from '@financial-times/n-es-client';

import service from '../../../../server/modules/es/service'

describe('ES Service', () => {

	const sandbox = sinon.createSandbox();
	let esStub;

	beforeEach(() => {
		esStub = sandbox.stub(es, 'get').resolves();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('get', () => {

		it('should get the UUID from ES', () => {
			return service.get('test')
				.then(() => {
					expect(esStub.calledWith('test')).to.eq(true);
				});
		});

		it('should only fetch required properties', () => {
			return service.get('test')
				.then(() => {
					const [ uuid, options ] = esStub.getCall(0).args;
					expect(options).to.have.deep.property('_source', ['id', 'title']);
				});
		});

	});

});
