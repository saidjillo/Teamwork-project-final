const express = require('express');
const router = express.Router();



employeesCtrl = require('../controllers/employees');
const checkUser = require("../middleware/userExist");
const auth = require("../middleware/auth");

router.post('/create-user', auth, checkUser, employeesCtrl.signup);
router.post('/signin', employeesCtrl.login);



module.exports = router;