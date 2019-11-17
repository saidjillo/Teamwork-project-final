const express = require('express');
const router = express.Router();


const articlesCtrl = require('../controllers/articles');
const auth = require("../middleware/auth");

router.post('/', auth.verifyToken, articlesCtrl.createArticle);



module.exports = router;
