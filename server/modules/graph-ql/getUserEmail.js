import { metrics } from '@financial-times/n-express';
import membQl from '@financial-times/n-memb-gql-client';
import STATIC_DATA from 'n-common-static-data';
import _get from 'lodash/get';
import MaskLogger from '@financial-times/n-mask-logger';
const logger = new MaskLogger(['email', 'password']);
const MEMB_GRAPH_QL_SVC = 'membership-graph-ql';

module.exports = async function returnEmail (session) {
    try {

				if (!session) {
					return null;
				}

        const membQueryResult = await membQl.query(STATIC_DATA.graphQL.userEmailQuery, { session });
        if (!membQueryResult._ok) {
            throw new Error ({name: 'content_error', message:'Membership API response content error'});
        } else {
            metrics.count(`${MEMB_GRAPH_QL_SVC}.res.success`, 1);
        }
        return _get(membQueryResult, 'data.userBySession.profiles.basic.email');
    } catch (e) {
        if (e.name === 'content_error') {
            metrics.count(`${MEMB_GRAPH_QL_SVC}.res.error`, 1);
            logger.warn({ svc: MEMB_GRAPH_QL_SVC, operation: 'query', name: 'getUserEmail', result: 'error' }, { message: _get(membQueryResult, 'errors[0].message') });
        } else {
            metrics.count(`${MEMB_GRAPH_QL_SVC}.res.failure`, 1);
            logger.error({ svc: MEMB_GRAPH_QL_SVC, operation: 'query', name: 'getUserEmail', result: 'failure' }, e);
        }
    }
};
