## Slack channel
**#ft-next-conversion** is the main source for alerts and reports regarding the app.

Pingdom results are reported here.

## Grafana Dashboards

Various graphs available:
* [Server health](http://grafana.ft.com/dashboard/db/b2b-prospect?orgId=1)

## Splunk Dashboard

To view errors in a more informative way than via Sentry, consider looking at splunk.


## Sentry Errors
Our automated output of errors, can be of limited use but sometimes helps, is especially useful at showing a spike of new issues: [sentry](https://sentry.io/nextftcom/ft-next-b2b-prospect/)

## Heroku Metrics
E.G. for the [EU metrics](https://dashboard.heroku.com/apps/ft-next-b2b-prospect/metrics/web?starting=24-hours-ago)

## App logs
Via `heroku logs`. Example command (for the EU region logs):
```
heroku logs -n 5000 -a ft-next-b2b-prospect-eu --tail
```

## Health Checks
The [health checks end point](https://next-b2b-prospect.ft.com/__health)

#### Troubleshooting

## Pingdom Checks

These are a subset of the useful pingdom checks that can tell you if an app is down

#### [Next B2B Prospect Form Uptime](https://my.pingdom.com/reports/uptime#check=3318043&daterange=7days&tab=uptime_tab)
Hits next-b2b-prospect.ft.com/form
