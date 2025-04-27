const Posts = require('../models/Posts');
const multer = require('multer');
const path = require('path');
const { sendNotification } = require('../services/socketService');

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

exports.createPosts = async (req, res) => {
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
			const posts = new Posts(data);
			await posts.save();

			sendNotification('posts_created', {
				message: `Создана новая новость: "${posts.title}"`,
				postsId: posts._id,
			});

			res.json(posts);
		} catch (err) {
			console.error('Error creating posts:', err);
			res.status(500).json({ message: 'Server error' });
		}
	});
};

exports.editPosts = async (req, res) => {
	try {
		const posts = await Posts.findById(req.params.id);
		if (!posts) return res.status(404).json({ message: 'Posts not found' });
		if (posts.author.toString() !== req.user.id) {
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

		Object.assign(posts, data);
		await posts.save();

		sendNotification('posts_updated', {
			message: `Новость "${posts.title}" была изменена`,
			postsId: posts._id,
		});

		res.json(posts);
	} catch (err) {
		console.error('Error editing posts:', err);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.deletePosts = async (req, res) => {
	try {
		const posts = await Posts.findById(req.params.id);
		if (!posts) {
			return res.status(404).json({ message: 'Posts not found' });
		}

		if (posts.author.toString() !== req.user.id) {
			return res.status(401).json({ message: 'Not authorized' });
		}

		await Posts.deleteOne({ _id: req.params.id });

		sendNotification('posts_deleted', {
			message: `Новость "${posts.title}" была удалена`,
			postsId: posts._id,
		});

		res.json({ message: 'Posts deleted' });
	} catch (err) {
		console.error('Error deleting posts:', err);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.publishPosts = async (req, res) => {
	try {
		const posts = await Posts.findById(req.params.id);
		if (!posts) return res.status(404).json({ message: 'Posts not found' });
		if (posts.author.toString() !== req.user.id) {
			return res.status(401).json({ message: 'Not authorized' });
		}
		posts.status = 'published';
		await posts.save();

		sendNotification('posts_published', {
			message: `Новость "${posts.title}" была опубликована`,
			postsId: posts._id,
		});

		res.json(posts);
	} catch (err) {
		console.error('Error publishing posts:', err);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.getAllPosts = async (req, res) => {
	try {
		const posts = await Posts.find().populate('author', 'username email');
		res.json(posts);
	} catch (err) {
		console.error('Error getting all posts:', err);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.getPostsById = async (req, res) => {
	try {
		const posts = await Posts.findById(req.params.id).populate(
			'author',
			'username email'
		);
		if (!posts) return res.status(404).json({ message: 'Posts not found' });
		res.json(posts);
	} catch (err) {
		console.error('Error getting posts by ID:', err);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.getMyPosts = async (req, res) => {
	try {
		const posts = await Posts.find({ author: req.user.id }).populate(
			'author',
			'username email'
		);
		res.json(posts);
	} catch (err) {
		console.error('Error getting user posts:', err);
		res.status(500).json({ message: 'Server error' });
	}
};
