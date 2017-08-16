import MaskLogger from '@financial-times/n-mask-logger';
import _get from 'lodash/get';

import Encoder from '../encoding/service';
import { ERROR_COOKIE, SUBMISSION_COOKIE } from './constants';

const logger = new MaskLogger(['email', 'password']);

export default {
	setLocals: (req, res, next) => {
		res.locals.campaignId = req.query.cpccampaign || '';
		res.locals.contentUuid = req.query['ft-content-uuid'] || '';
		return next();
	},

	validatePayload: (req, res, next) => {
		if (!_get(req, 'body.firstName') || !_get(req, 'body.lastName') || !_get(req, 'body.company')) {
			res.cookie(ERROR_COOKIE, 'Please fill out all fields.');
			return res.redirect(302, req.originalUrl);
		}
		return next();
	},

	validateRetrieval: (req, res, next) => {
		const submissionCookie = req.cookies[SUBMISSION_COOKIE]
		const decodedData = Encoder.decode(submissionCookie);

		if (!submissionCookie || !decodedData) {
			logger.error('Invalid or expired submission key', { cookieExists: !!submissionCookie });
			return res.redirect(303, 'http://ft.com');
		}

		res.locals.submission = decodedData;
		return next();
	}
}
