# fetchres [![Build Status](https://travis-ci.org/matthew-andrews/fetchres.svg?branch=ynosubclass)](https://travis-ci.org/matthew-andrews/fetchres)

Some useful response handlers for using [Fetch](https://github.com/github/fetch) API in the real world.

Warning: doesn't come with Fetch or Promise, so you'll need to bring your own polyfill (unless you're using this module within Service Workers, where both `fetch` and `Promise` are already defined).

## Installation

```sh
npm install --save fetchres
```

Or

```sh
bower install --save fetchres
```

## Usage (node)

```js
var fetchres = require('fetchres');

fetch('https://mattandre.ws/my-json-endpoint')
	.then(fetchres.json)
	.then(function(data) {
		// `data` is an object containing the data
		// from the response, not a Response object
		console.log(data);
	})
	.catch(function(err) {
		if (err.name === fetchres.BadServerResponseError.name) {
			// just a dodgy response
			console.error(err);
		} else if (err.name === fetchres.InvalidJsonError.name) {
			// malformed json, probably
			console.error('malformed json returned');
		} else {
			// something more serious could be wrong.
			// probably want to investigate / send to
			// error aggregation service
			debugger;
		}
	});
