node_modules/@financial-times/n-gage/index.mk:
	npm install --no-save --no-package-lock @financial-times/n-gage
	touch $@

-include node_modules/@financial-times/n-gage/index.mk

VAULT_NAME=ft-next-b2b-prospect
HEROKU_APP_STAGING=ft-next-b2b-prospect-staging
HEROKU_APP_EU=ft-next-b2b-prospect

build:
	nui build

build-production:
	nui build --production

watch:
	nui watch

test:
	make verify && make unit-test

unit-test:
	export MEMBQL_API_ENDPOINT_PROD=1; \
	export MEMBQL_API_KEY_PROD=1; \
	mocha --require server/setup --exit --require test/setup --recursive ./test

run:
	export DEBUG=ft-next-b2b-prospect-debug; \
	nht run --https --local

deploy-fastly:
	fastly-tools deploy -e --service FASTLY_SERVICE_ID --backends cdn/backends.json --main main.vcl ./cdn/
