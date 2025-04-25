const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

router.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

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
});

router.post('/upload-image', upload.any(), (req, res) => {
	if (!req.files || req.files.length === 0) {
		return res.status(400).json({ message: 'No files uploaded' });
	}

	const files = req.files.map((file) => ({
		url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
		filename: file.filename,
		originalname: file.originalname,
	}));

	res.json({ files });
});

module.exports = router;
