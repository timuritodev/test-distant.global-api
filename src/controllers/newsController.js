const News = require('../models/News');

exports.createNews = async (req, res) => {
	const data = req.body;
	data.author = req.user.id;
	try {
		const news = new News(data);
		await news.save();
		res.json(news);
	} catch (err) {
		res.status(500).json({ message: 'Server error' });
	}
};

exports.editNews = async (req, res) => {
	try {
		const news = await News.findById(req.params.id);
		if (!news) return res.status(404).json({ message: 'News not found' });
		if (news.author.toString() !== req.user.id) {
			return res.status(401).json({ message: 'Not authorized' });
		}
		Object.assign(news, req.body);
		await news.save();
		res.json(news);
	} catch (err) {
		res.status(500).json({ message: 'Server error' });
	}
};

exports.deleteNews = async (req, res) => {
	try {
		const news = await News.findById(req.params.id);
		if (!news) return res.status(404).json({ message: 'News not found' });
		if (news.author.toString() !== req.user.id) {
			return res.status(401).json({ message: 'Not authorized' });
		}
		await news.remove();
		res.json({ message: 'News deleted' });
	} catch (err) {
		res.status(500).json({ message: 'Server error' });
	}
};

exports.publishNews = async (req, res) => {
	try {
		const news = await News.findById(req.params.id);
		if (!news) return res.status(404).json({ message: 'News not found' });
		if (news.author.toString() !== req.user.id) {
			return res.status(401).json({ message: 'Not authorized' });
		}
		news.status = 'published';
		await news.save();
		res.json(news);
	} catch (err) {
		res.status(500).json({ message: 'Server error' });
	}
};
