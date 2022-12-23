const app = require('express');
const router = app.Router();
const CandidaterController = require('../app/controllers/candidate.c');
const passport = require('passport');

router.get('/home', CandidaterController.home);
router.get('/detail_job', CandidaterController.detail_job);
router.get('/manage_record', CandidaterController.manage_record);
router.post('/search_job', CandidaterController.postSearchJob);



//router.all('*', UserController.notFoundPage);

module.exports = router;