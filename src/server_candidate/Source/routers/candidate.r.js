const app = require('express');
const router = app.Router();
const CandidaterController = require('../app/controllers/candidate.c');
const passport = require('passport');


router.get('/login', CandidaterController.login);
router.get('/signup', CandidaterController.signup);
router.get('/forget_password', CandidaterController.forget_password);
router.get('/authentication', CandidaterController.authentication);
router.get('/reset_password', CandidaterController.reset_password);
router.get('/home', CandidaterController.home);
router.get('/detail_job', CandidaterController.detail_job);
router.get('/manage_record', CandidaterController.manage_record);

router.post('/signup', CandidaterController.postSignup);
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/candidate/login',
    successRedirect: '/candidate/home'
}), CandidaterController.postLogin);

router.get('/auth/google',
    passport.authenticate('google', { failureRedirect: '/candidate/login', successRedirect: '/candidate/home', failureMessage: true }));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/candidate/login', successRedirect: '/candidate/home', failureMessage: true }));

router.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/candidate/login', successRedirect: '/candidate/home', failureMessage: true }));

//router.all('*', UserController.notFoundPage);

module.exports = router;