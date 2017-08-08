import { sendMessage } from './utils';

export default {
	init: (container) => {

		const submissionToken = container.dataset['submissionToken'];
		if (submissionToken) {
			sendMessage({
				submission: submissionToken
			});
		}

  }
};
