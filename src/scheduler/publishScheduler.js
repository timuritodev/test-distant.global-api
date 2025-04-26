const cron = require('node-cron');
const News = require('../models/News');

cron.schedule('* * * * *', async () => {
	try {
		const now = new Date();
		const newsToPublish = await News.find({
			status: 'scheduled',
			publishAt: { $lte: now },
		});

		for (const news of newsToPublish) {
			news.status = 'published';
			await news.save();
			console.log(`Новость "${news.title}" опубликована автоматически`);
		}
	} catch (error) {
		console.error('Ошибка при автоматической публикации новостей:', error);
	}
});
