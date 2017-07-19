node_modules/@financial-times/n-gage/index.mk:
	npm install --no-save --no-package-lock @financial-times/n-gage
	touch $@

-include node_modules/@financial-times/n-gage/index.mk

TEST_APP := "ft-next-marketo-api-branch-${CIRCLE_BUILD_NUM}"

build:
	nui build

build-production:
	nui build --production

watch:
	nui watch

test:
	make verify && make unit-test

unit-test:
	mocha ./test --recursive

run:
	export DEBUG=ft-next-b2b-prospect-signup-debug; \
	nht run --local

provision:
	nht deploy-hashed-assets
	nht float -md --testapp ${TEST_APP}
	make a11y

deploy:
	nht ship -m

tidy:
	nht destroy ${TEST_APP}
