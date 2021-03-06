const express = require('express');
const router = express.Router();


const articlesCtrl = require('../controllers/articles');
const auth = require("../middleware/auth");

router.get('/', auth.verifyToken, articlesCtrl.getAllArticles);
router.get('/:userId', auth.verifyToken, articlesCtrl.getAllArticlesEmployeeSpecific);
router.get('/:articleId', auth.verifyToken, articlesCtrl.getOneArticle);
router.post('/', auth.verifyToken, articlesCtrl.createArticle);
router.delete('/:articleId', auth.verifyToken, articlesCtrl.deleteArticle);
router.put('/:articleId', auth.verifyToken, articlesCtrl.modifyArticle);


module.exports = router;
