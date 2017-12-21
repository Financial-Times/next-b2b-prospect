import Joi from 'joi';
import { expect } from 'chai';

import { SCHEMA } from '../../../../server/modules/marketo/constants';

const validPayload = {
	firstName: 'first',
	lastName: 'last',
	title: 'mr',
	company: 'foo',
	email: 'test@test.com',
	phone: '00000000000',
	country: 'GBR',
	numberOfEmployees: 5,
	rating: '5',
	Third_Party_Opt_In__c: true,
	leadSource: '',
	Industry_Sector__c: '',
	Lead_Type__c: '',
	CPCCampaign__c: '',
	GCLID__c: '',
	Comments: ''
};

describe('Marketo Service Payload Schema', () => {

	it('Pass valid payload, and sets safe defaults', () => {
		const { error, value } = Joi.validate(validPayload, SCHEMA, { abortEarly: false });
		expect(value.leadSource).to.equal('FT.com');
		expect(error).to.equal(null);
	});

});
