'use strict';

import getUserStatus from './get-user-status';

import { init as initDataStore } from './data-store';
import { init as initIconify } from './iconify';
import { init as initDownloadModal } from './modal-download';

function init (flags) {
	if (!flags.get('syndicationRedux')) {
		return;
	}

	getUserStatus().then(response => {
		if (response !== null) {
			initDataStore(flags);

			initIconify(flags);

			initDownloadModal(flags);
		}
	});
}

export { init };
