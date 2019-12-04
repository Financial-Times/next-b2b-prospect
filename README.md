# next-b2b-prospect

[![CircleCI](https://circleci.com/gh/Financial-Times/next-b2b-prospect.svg?style=svg&circle-token=6e4390fe3ecda2bd1d48703fa74024fff3979c0a)](https://circleci.com/gh/Financial-Times/next-b2b-prospect)

Embeddable B2B Prospect form which creates a unique lead Marketo.

### Setup

```bash
make install # install all dependencies
make build # compile assets
make .env # ensure environmental var dependencies exist
```

## Running locally
```
make run-local
```

## Access point
`Access the form locally via:` http://localhost:3002/form

`Production:` https://next-b2b-prospect.ft.com/form

### Endpoints

*	`GET /form`
	*	Renders the "Contact Form"
	* Pushes the lead data into Marketo
*	`POST /api/marketo`
	*	Marketo Interface to create or update leads
	* Has strict validation in place to prevent extra or  invalid fields.
