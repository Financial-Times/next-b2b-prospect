import sinon from 'sinon';
import { expect } from 'chai';
import proxyquire from 'proxyquire';
import Cache from '../../../../server/modules/cache/service';

describe('Cache Service', () => {

	const sandbox = sinon.sandbox.create();
	let bufferStub;
	let toStringStub;

	beforeEach(() => {
		toStringStub = sandbox.stub();
		bufferStub = sandbox.stub(Buffer, 'from').returns({
			toString: toStringStub
		});
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('encode', () => {

		const toStringResponse = 'some-hash';

		beforeEach(() => {
			toStringStub.returns(toStringResponse);
		});

		it('should convert data to a buffer', () => {
			const cacheItem = { mock: 'object' };
			Cache.encode(cacheItem);

			expect(bufferStub.calledOnce).to.eq(true);
			expect(bufferStub.calledWith(JSON.stringify(cacheItem))).to.eq(true);
		});

		it('should return a base64 string', () => {
			const cacheItem = { mock: 'object' };
			const encodedData = Cache.encode(cacheItem);

			expect(toStringStub.calledOnce).to.eq(true);
			expect(toStringStub.calledWith('base64')).to.eq(true);
			expect(encodedData).to.eq(toStringResponse);
		});

	});

	describe('decode', () => {

		const toStringResponse = JSON.stringify({
			decoded: 'payload'
		});
		const encodedStr = 'a-base64-string';

		beforeEach(() => {
			toStringStub.returns(toStringResponse);
		});

		it('should convert a base64 string to a buffer', () => {
			Cache.decode(encodedStr);

			expect(bufferStub.calledOnce).to.eq(true);
			expect(bufferStub.calledWith(encodedStr, 'base64')).to.eq(true);
			expect(toStringStub.calledOnce).to.eq(true);
		});

		it('should parse and return the payload', () => {
			const decodedData = Cache.decode(encodedStr);
			expect(decodedData).to.deep.equal(JSON.parse(toStringResponse));
		});

		it('should return null if the data is not valid', () => {
			toStringStub.returns('THIS-IS-NOT-AN-OBJECT!')
			const decodedData = Cache.decode(encodedStr);
			expect(decodedData).to.equal(null);
		});

	});

	describe('sanity', () => {

		beforeEach(() => sandbox.restore());

		it('should mean we actually confirm it works', () => {
			const testData = { sanity: 'test' };
			const encodedData = Cache.encode(testData);
			const decodedData = Cache.decode(encodedData);

			expect(decodedData).to.deep.equal(testData);

		});
	});
});
