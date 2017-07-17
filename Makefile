node_modules/@financial-times/n-gage/index.mk:
	npm install --no-save --no-package-lock @financial-times/n-gage
	touch $@

-include node_modules/@financial-times/n-gage/index.mk

TEST_APP := "ft-next-marketo-api-branch-${CIRCLE_BUILD_NUM}"

test:
	make verify && make unit-test

unit-test:
	mocha ./test --recursive

run:
	nht run --local

provision:
	nht float -md --testapp ${TEST_APP}

deploy:
	nht ship -m

tidy:
	nht destroy ${TEST_APP}
