const express = require('express');
const auth = require('../middleware/auth');
const {
	createNews,
	editNews,
	deleteNews,
	publishNews,
	getAllNews,
	getNewsById,
	getMyNews,
} = require('../controllers/newsController');
const router = express.Router();

router.get('/', getAllNews);
router.get('/:id', getNewsById);

router.use(auth);
router.get('/my', getMyNews);
router.post('/', createNews);
router.patch('/:id', editNews);
router.delete('/:id', deleteNews);
router.post('/:id/publish', publishNews);

module.exports = router;
