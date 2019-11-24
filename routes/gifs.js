const express = require('express');
const router = express.Router();


const gifsCtrl = require('../controllers/gifs');
const auth = require("../middleware/auth");

router.get('/', gifsCtrl.getAllGifs);
router.get('/:gifId', gifsCtrl.getOneGif);
router.post('/', gifsCtrl.createGif);
// router.put('/:gifId', gifsCtrl.modifyGif);
router.delete('/:gifId', gifsCtrl.deleteGif);



module.exports = router;
