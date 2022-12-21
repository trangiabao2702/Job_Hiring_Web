const express = require('express');
const router = express.Router();
const {
    signup,
    signin,
    forgetPassword,
}  = require('../app/controllers/auth.c');


router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgetPassword', forgetPassword);

module.exports = router;