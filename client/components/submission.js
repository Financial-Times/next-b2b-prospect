import { sendMessage, dispatchTrackingEvent } from './utils';

export default {
	init: (container) => {
		const shouldRedirect = container.dataset['shouldRedirect'];
		if (shouldRedirect) {
			sendMessage({
				submission: true
			});
		}

		dispatchTrackingEvent({
			category: 'b2b-prospect',
			action: 'submit'
		});
	}
};
