import express from '@financial-times/n-ui';
import MaskLogger from '@financial-times/n-mask-logger';
import nHealth from 'n-health';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import formRouter from './modules/form/router';
import apiRouter from './modules/api/router';

const logger = new MaskLogger(['email', 'password']);
const PORT = Number(process.env.PORT || 5657);

const app = express({
  systemCode: 'next-b2b-prospect',
  withJsonLd: false,
  healthChecks: nHealth(path.resolve(__dirname, './config/health-checks')).asArray(),
	withBackendAuthentication: false
});

app.locals.nUiConfig = {
	preset: 'discrete',
	features: {
		header: false,
		footer: false
	}
};

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))

// HOTFIX to overwrite n-express/src/middleware/security.js
app.use((req, res, next) => {
	res.removeHeader('X-Frame-Options');
	next();
})

app.get('/__gtg', (req, res) => res.send(200));

app.get('/__sw-prod.js', (req, res) => {
	fetch('https://ft.com/__sw-prod.js')
		.then(response => response.text())
		.then(js => {
			res.set('Content-Type', 'application/javascript');
			res.send(js);
		})

});

app.use('/form', formRouter);
app.use('/api', apiRouter);

app.get('*', (req, res) => res.redirect(302, `https://ft.com${req.originalUrl}`));

export default app;

export const ready = app.listen(PORT).then(() => {
	logger.info(`Listening on ${ PORT }`);
});
