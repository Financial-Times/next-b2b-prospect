import express from '@financial-times/n-ui';

import api from './api';
import middleware from './middleware';

const router = express.Router();

router.use([middleware.noCache]);

router.route('/confirm')
	.get(middleware.setLocals, middleware.validateRetrieval, api.confirm);

router.route('/:marketingName?')
	.get(middleware.setLocals, middleware.setTemplate, api.form)
	.post(middleware.setLocals, middleware.validatePayload, middleware.setTemplate, api.submit);


export default router;
