import express from '@financial-times/n-ui';
import bodyParser from 'body-parser';
import MaskLogger from '@financial-times/n-mask-logger';
import formRouter from './modules/form/router';

const logger = new MaskLogger(['email', 'password']);
const PORT = Number(process.env.PORT || 5657);

const app = express({
	systemCode: 'next-b2b-prospect',
});

app.use(bodyParser());

app.get('__gtg', (req, res) => res.send(200));

app.use('/form', formRouter);

export default app;

export const ready = app.listen(PORT).then(() => {
	logger.info(`Listening on ${ PORT }`);
});
