import raven from '@financial-times/n-raven';
import MaskLogger from '@financial-times/n-mask-logger';

import Marketo from '../marketo/service';

const logger = new MaskLogger(['email', 'password']);

export default {
	form: (req, res, next) => {

		res.set('Cache-Control', res.FT_HOUR_CACHE);
		res.render('form', {
			title: 'Signup',
			layout: 'vanilla',
			countryCode: res.locals.countryCode,
			campaignId: res.locals.campaignId,
		});

	},
	confirmation: async (req, res, next) => {

		try {
			const marketoResponse = await Marketo.createOrUpdate(req.body);
		} catch (err) {
			logger.error('Error submitting to Marketo', err);
			raven.captureError(err);
		} finally {
			res.render('confirm', {
				title: 'Signup',
				layout: 'vanilla'
			});
		}

	},
}
