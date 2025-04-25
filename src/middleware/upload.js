const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		let uploadPath = 'uploads/';
		if (file.mimetype.startsWith('image/')) {
			uploadPath += 'images/';
		} else {
			uploadPath += 'attachments/';
		}
		cb(null, uploadPath);
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + path.extname(file.originalname));
	},
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image/')) {
		cb(null, true);
	} else if (
		file.mimetype === 'application/pdf' ||
		file.mimetype === 'application/msword' ||
		file.mimetype ===
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
	) {
		cb(null, true);
	} else {
		cb(new Error('Неподдерживаемый тип файла'), false);
	}
};

const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
});

module.exports = upload;
