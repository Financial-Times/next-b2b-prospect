import { sendMessage } from './utils';

export default {
	init: (container) => {
		const shouldRedirect = container.dataset['shouldRedirect'];
		if (shouldRedirect) {
			sendMessage({
				submission: true
			});
		}
  }
};
