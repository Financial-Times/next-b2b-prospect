import Joi from 'joi';
import { expect } from 'chai';

import { SCHEMA } from '../../../../server/modules/marketo/constants';

const basePayload = {
	firstName: 'first',
	lastName: 'last',
	title: 'mr',
	company: 'foo',
	email: 'test@test.com',
	phone: '00000000000',
	country: 'GBR',
	numberOfEmployees: 5,
	rating: '5',
	leadSource: '',
	Industry_Sector__c: '',
	Lead_Type__c: '',
	CPCCampaign__c: '',
	GCLID__c: '',
	Comments: ''
};

const marketingPayload = {
	Third_Party_Opt_In__c: true
};

const consentPayload = {
	Consent_category_channelOne: true,
	Consent_category_channelTwo: false
};

describe('Marketo Service Payload Schema', () => {
	let legacyPayload;
	let validPayload;

	beforeEach(() => {
		// TODO: GDPR cleanup
		legacyPayload = Object.assign(
			marketingPayload,
			basePayload
		);
		
		validPayload = Object.assign(
			consentPayload,
			basePayload
		);
	});

	it('Passes valid payload, and sets safe defaults', () => {
		const { error, value } = Joi.validate(validPayload, SCHEMA, {
			abortEarly: false
		});
		expect(value.leadSource).to.equal('FT.com');
		expect(error).to.equal(null);
	});

	it('Validates consent payload', () => {
		validPayload.Consent_category_channelOne = 'invalid';
		const { error, value } = Joi.validate(validPayload, SCHEMA, {
			abortEarly: false
		});
		expect(error).to.have.property('name', 'ValidationError');
	});

	// TODO: GDPR cleanup
	it('Passes valid payload, and sets safe defaults (legacy marketing consent)', () => {
		const { error, value } = Joi.validate(legacyPayload, SCHEMA, {
			abortEarly: false
		});
		expect(value.leadSource).to.equal('FT.com');
		expect(error).to.equal(null);
	});
});
