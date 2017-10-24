node_modules/@financial-times/n-gage/index.mk:
	npm install --no-save --no-package-lock @financial-times/n-gage
	touch $@

-include node_modules/@financial-times/n-gage/index.mk

TEST_APP := "ft-next-b2b-prspct-branch-${CIRCLE_BUILD_NUM}"

build:
	nui build

build-production:
	nui build --production

watch:
	nui watch

test:
	make verify && make unit-test

unit-test:
	mocha --require server/setup --exit --require test/setup --recursive ./test

smoke:
	nht smoke ${TEST_APP}

run:
	export DEBUG=ft-next-b2b-prospect-debug; \
	nht run --https --local

provision:
	nht deploy-hashed-assets
	nht float -md --testapp ${TEST_APP}
	make a11y

deploy:
	nht deploy-hashed-assets --monitor-assets
	nht ship

deploy-fastly:
	fastly-tools deploy -e --service FASTLY_SERVICE_ID --backends cdn/backends.json --main main.vcl ./cdn/

tidy:
	nht destroy ${TEST_APP}
