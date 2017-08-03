import { metrics } from '@financial-times/n-express';
import raven from '@financial-times/n-raven';
import MaskLogger from '@financial-times/n-mask-logger';

import Marketo from '../marketo/service';
import * as errors from '../marketo/constants';

import { ERROR_COOKIE } from './constants';

const logger = new MaskLogger(['email', 'password']);

export default {
	form: (req, res, next) => {

		let error = req.cookies[ERROR_COOKIE];
		res.clearCookie(ERROR_COOKIE);

		res.set('Cache-Control', res.FT_HOUR_CACHE);
		return res.render('form', {
			title: 'Signup',
			layout: 'vanilla',
			campaignId: res.locals.campaignId,
			error
		});

	},
	confirmation: async (req, res, next) => {

		try {
			const marketoResponse = await (req.query.pa11y ? Promise.resolve() : Marketo.createOrUpdate(req.body));
			metrics.count('b2b-prospect.submission.success', 1);
			return res.render('confirm', {
				title: 'Signup',
				layout: 'vanilla'
			});

		} catch (err) {
			logger.error('Error submitting to Marketo', err);
			raven.captureError(err);
			let template = 'error';
			switch (err.type) {
				case errors.LEAD_ALREADY_EXISTS_ERROR:
					template = 'exists';
					metrics.count('b2b-prospect.submission.existing', 1);
					break;
				default:
					metrics.count('b2b-prospect.submission.error', 1);
					break;
			}

			return res.render(template, {
				title: 'Signup',
				layout: 'vanilla'
			});
		}

	},
}
