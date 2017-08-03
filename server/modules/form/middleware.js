import _get from 'lodash/get';

import { ERROR_COOKIE } from './constants';

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

	}
}
