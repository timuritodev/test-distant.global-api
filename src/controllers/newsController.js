const News = require('../models/News');

exports.createNews = async (req, res) => {
	const data = req.body;
	data.author = req.user.id;
	try {
		const news = new News(data);
		await news.save();
		res.json(news);
	} catch (err) {
		console.error('Error creating news:', err);
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
		console.error('Error editing news:', err);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.deleteNews = async (req, res) => {
	try {
		const news = await News.findById(req.params.id);
		if (!news) {
			return res.status(404).json({ message: 'News not found' });
		}

		if (news.author.toString() !== req.user.id) {
			return res.status(401).json({ message: 'Not authorized' });
		}

		await News.deleteOne({ _id: req.params.id });
		res.json({ message: 'News deleted' });
	} catch (err) {
		console.error('Error deleting news:', err);
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
		console.error('Error publishing news:', err);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.getAllNews = async (req, res) => {
	try {
		const news = await News.find().populate('author', 'username email');
		res.json(news);
	} catch (err) {
		console.error('Error getting all news:', err);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.getNewsById = async (req, res) => {
	try {
		const news = await News.findById(req.params.id).populate(
			'author',
			'username email'
		);
		if (!news) return res.status(404).json({ message: 'News not found' });
		res.json(news);
	} catch (err) {
		console.error('Error getting news by ID:', err);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.getMyNews = async (req, res) => {
	try {
		const news = await News.find({ author: req.user.id }).populate(
			'author',
			'username email'
		);
		res.json(news);
	} catch (err) {
		console.error('Error getting user news:', err);
		res.status(500).json({ message: 'Server error' });
	}
};
