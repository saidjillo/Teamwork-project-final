const express = require('express');
const router = express.Router();


const articlesCtrl = require('../controllers/articles');
const auth = require("../middleware/auth");

router.get('/', auth.verifyToken, articlesCtrl.getAllArticles);
router.get('/:articleId', auth.verifyToken, articlesCtrl.getOneArticle);
router.get('/:userId', auth.verifyToken, articlesCtrl.getAllArticlesEmployeeSpecific);

router.post('/', auth.verifyToken, articlesCtrl.createArticle);
router.post('/comments/:articleId', auth.verifyToken, articlesCtrl.createComment);
router.delete('/comments/:articleId', auth.verifyToken, articlesCtrl.deleteComment);
router.delete('/:articleId', auth.verifyToken, articlesCtrl.deleteArticle);
router.put('/:articleId', auth.verifyToken, articlesCtrl.modifyArticle);


module.exports = router;
// 