const News = require('../models/News');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		const ext = path.extname(file.originalname);
		cb(null, file.fieldname + '-' + uniqueSuffix + ext);
	},
});

const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		cb(null, true);
	},
}).fields([
	{ name: 'images', maxCount: 10 },
	{ name: 'attachments', maxCount: 10 },
]);

exports.createNews = async (req, res) => {
	upload(req, res, async (err) => {
		if (err) {
			return res
				.status(400)
				.json({ message: 'Ошибка загрузки файлов', error: err });
		}

		const data = req.body;
		data.author = req.user.id;

		if (data.publishAt) {
			const publishDate = new Date(data.publishAt);
			if (publishDate > new Date()) {
				data.status = 'scheduled';
			} else {
				data.status = 'published';
			}
		} else {
			data.status = 'draft';
		}

		if (req.files) {
			if (req.files.images) {
				data.images = req.files.images.map(
					(file) =>
						`${req.protocol}://${req.get('host')}/uploads/${file.filename}`
				);
			}
			if (req.files.attachments) {
				data.attachments = req.files.attachments.map(
					(file) =>
						`${req.protocol}://${req.get('host')}/uploads/${file.filename}`
				);
			}
		}

		try {
			const news = new News(data);
			await news.save();
			res.json(news);
		} catch (err) {
			console.error('Error creating news:', err);
			res.status(500).json({ message: 'Server error' });
		}
	});
};

exports.editNews = async (req, res) => {
	try {
		const news = await News.findById(req.params.id);
		if (!news) return res.status(404).json({ message: 'News not found' });
		if (news.author.toString() !== req.user.id) {
			return res.status(401).json({ message: 'Not authorized' });
		}

		const data = req.body;
		if (data.publishAt) {
			const publishDate = new Date(data.publishAt);
			if (publishDate > new Date()) {
				data.status = 'scheduled';
			} else {
				data.status = 'published';
			}
		}

		Object.assign(news, data);
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
