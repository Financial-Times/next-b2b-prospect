import { metrics } from '@financial-times/n-express';
import raven from '@financial-times/n-raven';
import MaskLogger from '@financial-times/n-mask-logger';

import Encoder from '../encoding/service';
import Content from '../content/service';
import ES from '../es/service';
import Marketo from '../marketo/service';
import Profile from '../profile/service';
import { countries } from '../../config/data.json';

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
			marketingName: res.locals.marketingName,
			isUnmasking: res.locals.marketingName === 'unmasking',
			countries,
			error
		});

	},

	submit: async (req, res, next) => {
		let shouldRedirect;
		let id;
		let marketoResponse = {};

		try {
			if (req.query.pa11y) {
				id = 'pally';
			} else {
				// Send off a save request, we don't care if it makes it
				if (res.locals.marketingName === 'unmasking') {
					Profile.save(res.locals.sessionToken, {
						firstName: req.body.firstName,
						lastName: req.body.lastName,
						primaryTelephone: req.body.primaryTelephone
					});
				}

				// Move the primaryTelephone and termsAcceptance field to expeted marketo fields
				let marketoPayload = Object.assign({}, req.body);
				marketoPayload.phone = marketoPayload.primaryTelephone;
				marketoPayload.Third_Party_Opt_In__c = marketoPayload.termsAcceptance;
				delete marketoPayload.primaryTelephone;
				delete marketoPayload.termsAcceptance;

				marketoResponse = await Marketo.createOrUpdate(marketoPayload);
				id = marketoResponse.id;
			}

			if (marketoResponse.status === 'updated') {
				metrics.count('b2b-prospect.submission.existing', 1);
				return res.render('exists', {
					title: 'Signup',
					layout: 'vanilla'
				});
			}

			if (res.locals.contentUuid){
				shouldRedirect = true;
				const { accessToken } = await Content.createAccessToken({
					uuid: res.locals.contentUuid
				});

				res.cookie(SUBMISSION_COOKIE, Encoder.encode({
					leadId: id,
					marketingName: res.locals.marketingName,
					contentUuid: res.locals.contentUuid,
					accessToken
				}), {
					expires: new Date(Date.now() + (1000 * 60 * 60)), httpOnly: true, secure: true
				});
			}

			metrics.count('b2b-prospect.submission.success', 1);

			// Clear AcquisitionContextRef on successful submission
			res.clearCookie('FTBarrierAcqCtxRef', { domain: '.ft.com', path: '/' });
			res.clearCookie('FTBarrier', { domain: '.ft.com', path: '/' });

			return res.render('confirm', {
				title: 'Signup',
				marketingName: res.locals.marketingName,
				isFactiva: res.locals.marketingName === 'factiva',
				contentUuid: res.locals.contentUuid,
				layout: 'vanilla',
				page: 'submission',
				shouldRedirect
			});

		} catch (err) {
			logger.error('Error submitting to Marketo', err);
			raven.captureError(err);
			metrics.count('b2b-prospect.submission.error', 1);
			return res.render('error', {
				title: 'Signup',
				layout: 'vanilla'
			});
		}

	},

	confirm: async (req, res, next) => {
		const template = 'confirm';
		const { leadId, contentUuid, accessToken, marketingName } = res.locals.submission;
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
						userNav: false, // turns off the log-in/log-out/subscribe/etc links in the header
						variant: 'logo-only'
					}
				},
				leadId,
				marketingName,
				contentUuid,
				article,
				accessToken
			});
		}
	}

}
