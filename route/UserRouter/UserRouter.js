const express = require('express');
const { register, logout, resetPassword, login, updateUser, forgotPassword } = require('../../controller/UserController');
const { refreshToken } = require('../../components/RefreshToken/RefreshToken');
const { authMiddleWare } = require('../../middleware/AuthMiddleWare');
const router = express.Router();

router.post("/refreshToken",authMiddleWare, refreshToken)
router.patch("/updateUser",authMiddleWare, updateUser)
router.post('/register',register );
router.post('/logout',logout );
router.post('/resetPassword/:token',resetPassword );
router.post('/login',login );
router.post('/forgotPassword',forgotPassword );


module.exports = router;