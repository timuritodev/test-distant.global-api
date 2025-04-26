const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch (err) {
		console.error('Error getting user info:', err);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.register = async (req, res) => {
	const { username, email, password } = req.body;
	try {
		let user = await User.findOne({ email });
		if (user) return res.status(400).json({ message: 'User already exists' });
		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(password, salt);
		user = new User({ username, email, password: hashed });
		await user.save();
		const payload = { user: { id: user.id } };
		jwt.sign(
			payload,
			process.env.JWT_SECRET,
			{ expiresIn: '1d' },
			(err, token) => {
				if (err) throw err;
				res.json({
					token,
					user: {
						id: user.id,
						username: user.username,
						email: user.email,
						createdAt: user.createdAt,
					},
				});
			}
		);
	} catch (err) {
		console.error('Error in registration:', err);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ message: 'Invalid credentials' });
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch)
			return res.status(400).json({ message: 'Invalid credentials' });
		const payload = { user: { id: user.id } };
		jwt.sign(
			payload,
			process.env.JWT_SECRET,
			{ expiresIn: '1d' },
			(err, token) => {
				if (err) throw err;
				res.json({
					token,
					user: {
						_id: user.id,
						username: user.username,
						email: user.email,
						createdAt: user.createdAt,
					},
				});
			}
		);
	} catch (err) {
		console.error('Error in login:', err);
		res.status(500).json({ message: 'Server error' });
	}
};
