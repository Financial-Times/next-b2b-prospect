import express from '@financial-times/n-express';

import api from './api';
import middleware from './middleware';

const router = express.Router();

router.use([middleware.noCache]);

router.route('/confirm')
	.get(middleware.setLocals, middleware.validateRetrieval, api.confirm);

router.route('/:marketingName?')
	.get(middleware.setLocals, api.form)
	.post(middleware.setLocals, middleware.validatePayload, api.submit);


export default router;
