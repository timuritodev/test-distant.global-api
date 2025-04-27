const express = require('express');
const auth = require('../middleware/auth');
const {
	createPosts,
	editPosts,
	deletePosts,
	publishPosts,
	getAllPosts,
	getPostsById,
	getMyPosts,
} = require('../controllers/postsController');
const router = express.Router();

router.get('/', getAllPosts);
router.get('/:id', getPostsById);

router.use(auth);
router.get('/my', getMyPosts);
router.post('/', createPosts);
router.patch('/:id', editPosts);
router.delete('/:id', deletePosts);
router.post('/:id/publish', publishPosts);

module.exports = router;
