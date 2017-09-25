import Joi from 'joi';

export const NOT_FOUND_ERROR = 'marketo/not_found';
export const UNEXPECTED_RESULT_ERROR = 'marketo/unexpected_result';
export const LEAD_ALREADY_EXISTS_ERROR = 'lead_already_exists';

export const SCHEMA = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    title: Joi.string().required(),
    company: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(5).max(15).regex(/^[0-9]+$/, 'all numbers').required(),
    country: Joi.string().required(),
    numberOfEmployees: Joi.number().default('0'),
    rating: Joi.string().required(),
    Third_Party_Opt_In__c: Joi.bool().required(),
    leadSource: Joi.string().default('FT.com'),
    Industry_Sector__c: Joi.string().default('null'),
    Lead_Type__c: Joi.string().default('Corporate'),
    CPCCampaign__c: Joi.string().default(''),
    GCLID__c: Joi.string().default(''),
    Comments: Joi.string().default('')
}).rename('jobTitle', 'title');