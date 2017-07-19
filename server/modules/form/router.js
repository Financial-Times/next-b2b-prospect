import express from '@financial-times/n-ui';

import api from './api';
import middleware from './middleware';

const router = express.Router();

router.use(middleware)

router.route('/')
	.get(api.form)
	.post(api.confirmation);

export default router;
