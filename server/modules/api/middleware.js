import Marketo from '../marketo/service';

export default {

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