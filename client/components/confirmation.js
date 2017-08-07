import { sendMessage } from './utils';

export default {
	init: (container) => {

		const submissionToken = container.dataset['submissionToken'];
		if (submissionToken) {
			console.log("SEND THAT SHEET");
			sendMessage({
				submission: submissionToken
			});
		}

  }
};
