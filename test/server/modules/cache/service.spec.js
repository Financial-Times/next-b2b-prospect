import sinon from 'sinon';
import { expect } from 'chai';
import proxyquire from 'proxyquire';

describe('Cache Service', () => {

	const sandbox = sinon.sandbox.create();
	let Cache;
	let setStub;
	let getStub;

	beforeEach(() => {
		setStub = sandbox.stub();
		getStub = sandbox.stub();
		Cache = proxyquire('../../../../server/modules/cache/service', {
			'@financial-times/n-map-cache-light': {
				TimeCache: createMockCache(getStub, setStub)
			}
		});

	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('set', () => {

		it('should set the data with a unique UID', () => {
			const cacheItem = 'test';
			Cache.set(cacheItem);
			expect(setStub.calledOnce).to.eq(true);
			const [key, value] = setStub.getCall(0).args;

			expect(/[\w]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12}/.test(key)).to.equal(true);
			expect(value).to.equal(cacheItem);
		});

		it('should return the cache key', () => {
			const cacheKey = Cache.set('test');
			expect(setStub.calledOnce).to.eq(true);
			const [key, value] = setStub.getCall(0).args;

			expect(/[\w]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12}/.test(cacheKey)).to.equal(true);
			expect(cacheKey).to.eq(key);
		});

	});

	describe('get', () => {

		it('should retrieve the cache item', () => {
			const cacheKey = 'test';
			const cacheItem = 'item';
			getStub.returns(cacheItem);

			const result = Cache.get(cacheKey);
			const [key] = getStub.getCall(0).args;

			expect(key).to.eq(cacheKey);
			expect(result).to.eq(cacheItem);

		});

	});
});

const createMockCache = (getStub, setStub) => class MockCache {
	constructor() {
		return {
			get: getStub,
			set: setStub
		}
	}
}
