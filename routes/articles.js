const express = require('express');
const router = express.Router();


const articlesCtrl = require('../controllers/articles');
const auth = require("../middleware/auth");

router.post('/', auth.verifyToken, articlesCtrl.createArticle);
router.delete('/:articleId', auth.verifyToken, articlesCtrl.deleteArticle);


module.exports = router;
