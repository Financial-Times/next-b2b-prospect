# Next Session Client
[![Build Status](https://snap-ci.com/Financial-Times/next-session-client/branch/master/build_image)](https://snap-ci.com/Financial-Times/next-session-client/branch/master)

A client for working with the [Next Session service](https://github.com/Financial-Times/next-session).

**Note**: this module is for **client side usage only**; if working from the server, talk to the [Membership Session service](https://developer.ft.com/docs/membership_platform_api) directly.

## Installing

	bower i -S next-session-client


## Usage

	const session = require('next-session-client');

    // get the user's uuid from their session
	session.uuid()
        .then(({ uuid }) {
    		// uuid is `undefined` if session isn't valid
    	});

	// get user's products
	session.products()
        .then(({ products, uuid }) {
        });

	// get (secure) session id
	const sessionId = session.sessionId();
