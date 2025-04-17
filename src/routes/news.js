const express = require('express');
const auth = require('../middleware/auth');
const {
	createNews,
	editNews,
	deleteNews,
	publishNews,
} = require('../controllers/newsController');
const router = express.Router();

router.use(auth);
router.post('/', createNews);
router.patch('/:id', editNews);
router.delete('/:id', deleteNews);
router.post('/:id/publish', publishNews);

module.exports = router;
