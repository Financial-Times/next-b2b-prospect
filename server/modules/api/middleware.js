import Marketo from '../marketo/service';

export default {

    requireApiKey: (req, res, next) => {

        if (!process.env.CLIENT_API_KEY) {
            throw new Error('You must set Client API keys in you environment');
        }

        if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
            return res.status(426).send('Client request must use TLS'); // http://tools.ietf.org/html/rfc2817#section-4.2
        }

        if (!req.headers['x-api-key'] || process.env.CLIENT_API_KEY !== req.headers['x-api-key']) {
            return res.sendStatus(403);
        } else {
            next();
        }
    },

    validateMarketoPayload: (req, res, next) => {

        const { error, value } = Marketo.validate(req.body);

        if (error) {
            return res.status(400).json({
                error: error.name,
                errors: error.details.map(detail => ({ 
                    message: detail.message,
                    property: detail.context.key
                }))
            });
        }
        res.locals.payload = value;
        next();
    }

}