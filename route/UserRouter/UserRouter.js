const express = require('express');
const { register, logout, resetPassword, login } = require('../../controller/UserController');
const router = express.Router();


router.post('/register',register );
router.post('/logout',logout );
router.post('/resetPassword/:token',resetPassword );
router.post('/login',login );


module.exports = router;