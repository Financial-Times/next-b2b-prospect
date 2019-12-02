import { PageKitHandlebars, helpers } from '@financial-times/dotcom-server-handlebars';
import express from '@financial-times/n-express';
import MaskLogger from '@financial-times/n-mask-logger';
import nHealth from 'n-health';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';

import formRouter from './modules/form/router';
import apiRouter from './modules/api/router';

const assetsMiddleware = require('@financial-times/dotcom-middleware-assets');
const navigationMiddleware = require('@financial-times/dotcom-middleware-navigation');

const isProduction = process.env.NODE_ENV === 'production';

const logger = new MaskLogger(['email', 'password']);
const PORT = Number(process.env.PORT || 5657);

const app = express({
	systemCode: 'next-b2b-prospect',
	appName: 'b2b-prospect',
	graphiteName: 'b2b-prospect',
	withConsent: true,
	withAnonMiddleware: false,
	withFlags: false,
	withJsonLd: false,
	healthChecks: nHealth(path.resolve(__dirname, './config/health-checks')).asArray(),
	withBackendAuthentication: false,
	helpers: require('@financial-times/n-conversion-forms/helpers')
});

app.engine('.html', new PageKitHandlebars({ helpers }).engine);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(navigationMiddleware.init());
app.use(
	assetsMiddleware.init({
		hostStaticAssets: !isProduction,
		publicPath: isProduction ? '/__assets/hashed/page-kit' : '/__dev/assets/b2b-prospect'
	})
);

// HOTFIX to overwrite n-express/src/middleware/security.js
app.use((req, res, next) => {
	res.removeHeader('X-Frame-Options');
	next();
})

app.get('/__gtg', (req, res) => res.send(200));

app.use('/form', formRouter);
app.use('/api', apiRouter);

app.get('*', (req, res) => res.redirect(302, `https://ft.com${req.originalUrl}`));

export default app;

export const ready = app.listen(PORT).then(() => {
	logger.info(`Listening on ${ PORT }`);
});
