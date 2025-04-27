const cron = require('node-cron');
const Posts = require('../models/Posts');

cron.schedule('* * * * *', async () => {
	try {
		const now = new Date();
		const postsToPublish = await Posts.find({
			status: 'scheduled',
			publishAt: { $lte: now },
		});

		for (const posts of postsToPublish) {
			posts.status = 'published';
			await posts.save();
			console.log(`Новость "${posts.title}" опубликована автоматически`);
		}
	} catch (error) {
		console.error('Ошибка при автоматической публикации новостей:', error);
	}
});
