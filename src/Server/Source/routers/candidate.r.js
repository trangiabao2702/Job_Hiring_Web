const app = require('express');
const router = app.Router();
const CandidaterController = require('../app/controllers/candidate.c');




router.get('/login', CandidaterController.login);
router.get('/signup',CandidaterController.signup);
router.get('/forget_password',CandidaterController.forget_password);
router.get('/authentication',CandidaterController.authentication);
router.get('/reset_password',CandidaterController.reset_password);
router.get('/home',CandidaterController.home);
router.get('/detail_job',CandidaterController.detail_job);
router.get('/manage_record',CandidaterController.manage_record);

router.post('/signup', CandidaterController.postSignup);


//router.all('*', UserController.notFoundPage);

module.exports = router;