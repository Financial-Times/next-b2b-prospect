export default (url, { credentials = 'omit' } = {}) => {
	return fetch(`https://session-next.ft.com${url}`, {
		credentials,
		useCorsProxy: true
	})
		.then(response => {
			if (response.ok){
				return response.json();
			} else {
				return response.text()
					.then(text => {
						throw new Error(`Next session responded with "${text}" (${response.status})`);
					});
			}
		})
		.catch(err => {
			document.body.dispatchEvent(new CustomEvent('oErrors.log', {
				bubbles: true,
				detail: {
					error: err,
					info: {
						component: 'next-session-client'
					}
				}
			}));
		});
}
