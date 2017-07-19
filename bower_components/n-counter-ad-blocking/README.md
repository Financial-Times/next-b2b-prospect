# n-counter-ad-blocking
Component to manage actions to encourage whitelisting

## How to use;
Incorporated into n-ui/ads, so if that is being used in your app, you already have it.

## Feature Flag Control

`sourcepoint`: controls the initiating of the adBlock check. Without this on, no adBlock check takes place, so no actions would be taken.

`adCounterBlocking`: once adBlocking has been detected, this feature flag determines whether actions will be initiated.

## Configuration

Options for how the counter ad blocking actions are activated are within `/src/qualification`

- Min Screen Width: set to 980px, browser width below this will not invoke action (though the overlay and banner will responsively display on smaller browsers).

- Apps Applied to: set to article, front page and stream-page; actions will not be invoked if app is not in this list.

### Cohort Flags

Cohort flags are then used as the final step of qualification before action is invoked. These can be either standard or MVT controlled settings.

A cohort flag for which actions are required should set `options.type` to either `overlay` or `banner`.

Additionally for overlays `options.close` should be set to either `true` - or `false`

The way in which this is implemented can be different for each cohort. A `b2c-decision` function currently calculates these settings for B2C Subscribers and for Registered users it is set simply within `qualification`.

#### Close Options for Overlay

`false`: user cannot exit the overlay, except by either;
- whitelisting ft.com and refreshing the page
- following one of the links on the overlay
- pressing the back button

`true`: user can exit the overlay by;
- clicking the [X]
- pressing ESC
- any other the actions outline against `false`

#### Banner Characteristics

Banner is `sticky` at the bottom of the screen with margin allowance added to the bottom of the body so no content is lost.
The banner cannot be dismissed.

## Running Locally

`make install demo` will bring up a demo site at `https://local.ft.com:5005`

There are demo pages for;
- Non-closeable Overlay (with and without the adblock check)
- Closeable Banner (with and without the adblock check) - using the `b2c-decision` function behaviour detailed above.
- html for pa11y (overlay and banner)
