const express = require('express');
const router = express.Router();


const gifsCtrl = require('../controllers/gifs');
const auth = require("../middleware/auth");

router.get('/', auth.verifyToken, gifsCtrl.getAllGifs);
router.get('/:gifId', auth.verifyToken, gifsCtrl.getOneGif);
router.post('/', auth.verifyToken, gifsCtrl.createGif);
// router.put('/:gifId', gifsCtrl.modifyGif);
router.delete('/:gifId', auth.verifyToken, gifsCtrl.deleteGif);


module.exports = router;
