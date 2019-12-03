import { dispatchTrackingEvent } from './utils';

export default {
	init: (container) => {

		const leadId = container.dataset['leadId'];
		const articleId = container.dataset['articleId'];

		dispatchTrackingEvent({
			category: 'b2b-prospect',
			action: 'confirmation',
				data: {
					leadId,
					articleId
				}
		});

	}
};
