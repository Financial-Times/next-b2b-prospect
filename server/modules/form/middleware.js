import _get from 'lodash/get';

export default {
	setLocals: (req, res, next) => {
		res.locals.countryCode = req.query.countryCode || 'GBR';
		res.locals.campaignId = req.query.cpccampaign || '';
		return next();
	},
	validatePayload: (req, res, next) => {

		if (!_get(req, 'body.firstName') || !_get(req, 'body.lastName') || !_get(req, 'body.company')) {
			return res.redirect(302, req.originalUrl);
		}
		return next();
	}
}
