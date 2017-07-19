module.exports = () => {
	const today = new Date();
	let dd = today.getDate();
	let mm = today.getMonth()+1; //January is 0!
	const yyyy = today.getFullYear();
	dd = `${dd<10 ? '0' : ''}${dd}`;
	mm = `${mm<10 ? '0' : ''}${mm}`;
	return `${dd}/${mm}/${yyyy}`;
};
