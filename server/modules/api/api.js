import raven from '@financial-times/n-raven';
import MaskLogger from '@financial-times/n-mask-logger';

import Marketo from '../marketo/service';
const logger = new MaskLogger(['firstName', 'lastName', 'email']);

export default {

    marketo: async (req, res, next) => {

        try {
            const marketoResponse = await Marketo.createOrUpdate(res.locals.payload);
            return res.status(200).json({
                details: Object.assign(res.locals.payload, marketoResponse)
            });

        } catch (error) {
            logger.error(`marketo api - Error submitting to Marketo: ${error.message}`);
            raven.captureError(error);
            return res.status(500).json({
                error: 'MarketoError',
                type: error.type,
                message: error.message,
                reason: error.reason
            });
        }
    }

}
