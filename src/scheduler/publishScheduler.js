const cron = require('node-cron');
const News = require('../models/News');

cron.schedule('* * * * *', async () => {
	const now = new Date();
	const due = await News.find({
		status: 'scheduled',
		publishAt: { $lte: now },
	});
	for (let item of due) {
		item.status = 'published';
		await item.save();
	}
});
