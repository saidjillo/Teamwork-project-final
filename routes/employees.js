const express = require('express');
const router = express.Router();



const employeesCtrl = require('../controllers/employees');
const checkUser = require("../middleware/userExist");
const auth = require("../middleware/auth");

router.post('/create-user', auth.verifyToken, auth.isAdmin, checkUser, employeesCtrl.signup);
router.post('/signin', employeesCtrl.login);



module.exports = router;