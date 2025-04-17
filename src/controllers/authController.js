const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
			{ expiresIn: '1h' },
			(err, token) => {
				if (err) throw err;
				res.json({ token });
			}
		);
	} catch (err) {
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
			{ expiresIn: '1h' },
			(err, token) => {
				if (err) throw err;
				res.json({ token });
			}
		);
	} catch (err) {
		res.status(500).json({ message: 'Server error' });
	}
};
