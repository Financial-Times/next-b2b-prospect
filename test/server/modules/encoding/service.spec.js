import sinon from 'sinon';
import { expect } from 'chai';
import proxyquire from 'proxyquire';
import Encoder from '../../../../server/modules/encoding/service';

describe('Encoder Service', () => {

	const sandbox = sinon.createSandbox();
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
			Encoder.encode(cacheItem);

			expect(bufferStub.calledOnce).to.eq(true);
			expect(bufferStub.calledWith(JSON.stringify(cacheItem))).to.eq(true);
		});

		it('should return a base64 string', () => {
			const cacheItem = { mock: 'object' };
			const encodedData = Encoder.encode(cacheItem);

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
			Encoder.decode(encodedStr);

			expect(bufferStub.calledOnce).to.eq(true);
			expect(bufferStub.calledWith(encodedStr, 'base64')).to.eq(true);
			expect(toStringStub.calledOnce).to.eq(true);
		});

		it('should parse and return the payload', () => {
			const decodedData = Encoder.decode(encodedStr);
			expect(decodedData).to.deep.equal(JSON.parse(toStringResponse));
		});

		it('should return null if the data is not valid', () => {
			toStringStub.returns('THIS-IS-NOT-AN-OBJECT!')
			const decodedData = Encoder.decode(encodedStr);
			expect(decodedData).to.equal(null);
		});

	});

	describe('sanity', () => {

		beforeEach(() => sandbox.restore());

		it('should mean we actually confirm it works', () => {
			const testData = { sanity: 'test' };
			const encodedData = Encoder.encode(testData);
			const decodedData = Encoder.decode(encodedData);

			expect(decodedData).to.deep.equal(testData);

		});
	});
});
