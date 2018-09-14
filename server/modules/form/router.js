import express from '@financial-times/n-ui';

import api from './api';
import middleware from './middleware';

const router = express.Router();

router.use([middleware.setLocals, middleware.noCache])


router.route('/')
	.get(api.form)
	.post(middleware.validatePayload, api.submit);

router.route('/confirm')
	.get(middleware.validateRetrieval, api.confirm);

export default router;
