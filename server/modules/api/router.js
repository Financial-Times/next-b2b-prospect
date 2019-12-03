import express from '@financial-times/n-express';
import bodyParser from 'body-parser';

import api from './api';
import middleware from './middleware'

const router = express.Router();

router.use(middleware.requireApiKey);
router.use(bodyParser.json());

router.route('/marketo')
    .post(middleware.validateMarketoPayload, api.marketo);

export default router;
