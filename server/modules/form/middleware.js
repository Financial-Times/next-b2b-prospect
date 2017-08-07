import MaskLogger from '@financial-times/n-mask-logger';
import _get from 'lodash/get';

import Cache from '../cache/service';
import { ERROR_COOKIE } from './constants';

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
		const token = _get(req, 'query.submission', '');
		const entry = Cache.get(token);

		if (!token || !entry) {
			logger.error('Invalid or expired submission key', { token });
			return res.redirect(303, 'http://ft.com');
		}

		res.locals.submission = entry;
		return next();
	}
}
