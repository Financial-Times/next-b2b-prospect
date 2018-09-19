import raven from '@financial-times/n-raven';
import MaskLogger from '@financial-times/n-mask-logger';
import { LEAD_ALREADY_EXISTS_ERROR } from '../marketo/constants';

import Marketo from '../marketo/service';
const logger = new MaskLogger(['firstName', 'lastName', 'email']);

export default {

	marketo: async (req, res, next) => {

		try {
			const marketoResponse = await Marketo.createOrUpdate(res.locals.payload);
			return res.status(200).json({
				details: Object.assign(res.locals.payload, marketoResponse)
			});

		} catch (error) {
			logger.error(`marketo api - Error submitting to Marketo: ${error.message}`);
			raven.captureError(error);
			const statusCode = (error.type === LEAD_ALREADY_EXISTS_ERROR) ? 400 : 500;
			return res.status(statusCode).json({
				error: 'MarketoError',
				type: error.type,
				message: error.message,
				reason: error.reason
			});
		}
	}

}
