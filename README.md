# next-b2b-prospect

[![CircleCI](https://circleci.com/gh/Financial-Times/next-b2b-prospect-signup/tree/master.svg?style=svg)](https://circleci.com/gh/Financial-Times/next-b2b-prospect-signup/tree/master)

Embeddable B2B Prospect form which creates a unique lead Marketo.

### Run locally
`make build run` then access the form locally at `https://local.ft.com:3002/form`

### Endpoints

*	`GET /form`
	*	Renders the "Contact Form"
	* Pushes the lead data into Marketo
*	`POST /api/marketo`
	*	Marketo Interface to create or update leads
	* Has strict validation in place to prevent extra or  invalid fields.
