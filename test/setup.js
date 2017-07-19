import { ready } from '../server/init';

before(function (done) {
	ready.then(done);
});
