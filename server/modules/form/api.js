import { metrics } from '@financial-times/n-express';
import raven from '@financial-times/n-raven';
import MaskLogger from '@financial-times/n-mask-logger';

import Encoder from '../encoding/service';
import Content from '../content/service';
import ES from '../es/service';
import Marketo from '../marketo/service';
import * as errors from '../marketo/constants';

import { SUBMISSION_COOKIE, ERROR_COOKIE } from './constants';

const logger = new MaskLogger(['email', 'password']);

export default {
	form: (req, res, next) => {

		let error = req.cookies[ERROR_COOKIE];
		if (error) {
			res.clearCookie(ERROR_COOKIE);
		}

		res.set('Cache-Control', res.FT_NO_CACHE);
		res.set('Surrogate-Control', res.FT_HOUR_CACHE);

		return res.render('form', {
			title: 'Signup',
			layout: 'vanilla',
			campaignId: res.locals.campaignId,
			error
		});

	},

	submit: async (req, res, next) => {
		let shouldRedirect;

		try {
			const { id } = await (req.query.pa11y ? Promise.resolve({ id: 'pa11y' }) : Marketo.createOrUpdate(req.body));

			if (res.locals.contentUuid){
				shouldRedirect = true;
				const { accessToken } = await Content.createAccessToken({
					uuid: res.locals.contentUuid
				});

				res.cookie(SUBMISSION_COOKIE, Encoder.encode({
					leadId: id,
					contentUuid: res.locals.contentUuid,
					accessToken
				}), {
					expires: new Date(Date.now() + (1000 * 60 * 60)), httpOnly: true, secure: true
				});
			}

			metrics.count('b2b-prospect.submission.success', 1);
			return res.render('confirm', {
				title: 'Signup',
				layout: 'vanilla',
				page: 'submission',
				shouldRedirect
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

	confirm: async (req, res, next) => {

		const template = 'confirm';
		const { leadId, contentUuid, accessToken } = res.locals.submission;
		let article;

		try {
			article = await ES.get(contentUuid);
			metrics.count('b2b-prospect.confirmation.success', 1);
		} catch (e) {
			template = 'error';
		} finally {
			return res.render(template, {
				title: 'Signup',
				layout: 'wrapper',
				wrapped: true,
				page: 'confirmation',
				nUi: {
			    header: {
						userNav: false // turns off the log-in/log-out/subscribe/etc links in the header
					}
				},
				leadId,
				article,
				accessToken
			});
		}
	}

}
