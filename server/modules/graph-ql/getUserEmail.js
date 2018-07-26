import { metrics } from '@financial-times/n-express';
import membQl from '@financial-times/n-memb-gql-client';
import STATIC_DATA from 'n-common-static-data';
import _get from 'lodash/get';
import MaskLogger from '@financial-times/n-mask-logger';
const logger = new MaskLogger(['email', 'password']);
const MEMB_GRAPH_QL_SVC = 'membership-graph-ql';

const run = (method = 'query', query, variables, testEnv = false, mockEnv = false, name) => {
    return membQl[method](query, variables, testEnv, mockEnv)
        .then(result => {
            if (!result._ok) {
                metrics.count(`${MEMB_GRAPH_QL_SVC}.res.error`, 1);
                logger.warn({ svc: MEMB_GRAPH_QL_SVC, operation: method, name, result: 'error' }, { message: _get(result, 'errors[0].message') });
            } else {
                metrics.count(`${MEMB_GRAPH_QL_SVC}.res.success`, 1);
            }
            return result;
        })
        .catch(error => {
            metrics.count(`${MEMB_GRAPH_QL_SVC}.res.failure`, 1);
            logger.error({ svc: MEMB_GRAPH_QL_SVC, operation: method, name, result: 'failure' }, error);
            throw error;
        });
};

const getUserEmailData = (sessionCookie, testEnv = false, mockEnv = false) => {
    /*
    note: we always POST, rather than use a canned GET to ensure we have
    the most up to date data and avoid any caching.
    note: when updating query please check/update the mock reponse
    matcher in 'next-mship-mock-api'
    */
    return run(
        'query',
        STATIC_DATA.graphQL.userEmailQuery,
        { session: sessionCookie },
        false,
        false,
        'getUserSessionEmail'
    );
};

module.exports = async function returnEmail (req) {
    try {
        const session = req.cookies.FTSession_s;
        const apiResponse = await getUserEmailData(session);
        return _get(apiResponse, 'data.userBySession.profiles.basic.email');
    } catch (e) {
        logger.error({
            event: 'RETRIEVE_USR_EMAIL_FROM_MEMB_API_ERROR',
            error: e.name, message: e.message || e.errorMessage
        }, e.data);
    }
};