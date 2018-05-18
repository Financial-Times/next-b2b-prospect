import sinon from 'sinon';
import { expect } from 'chai';
import service from '../../../../server/modules/profile/service';

describe.only('Profile Service', () => {
    describe('save', () => {
        const sandbox = sinon.sandbox.create();

		beforeEach(() => {
			sandbox.stub(global, 'fetch').resolves();
		});

		afterEach(() => {
			sandbox.restore();
        });
        
        it('should reject before sending a response if no session', done => {
            service.save('', {})
                .catch(() => {
                    expect(global.fetch.called).to.be.false;
                    done();
                });
        });

        it('should fetch if a session is passed', done => {
            service.save('test-session', {})
                .then(() => {
                    expect(global.fetch.called).to.be.true;
                    done();
                });
        });
    });
});