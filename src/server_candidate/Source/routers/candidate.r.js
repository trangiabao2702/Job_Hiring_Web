const app = require('express');
const router = app.Router();
const CandidaterController = require('../app/controllers/candidate.c');
const passport = require('passport');

router.get('/home', CandidaterController.home);
router.get('/detail_job/:id', CandidaterController.detail_job);
router.get('/manage_record', CandidaterController.manage_record);


// 404
router.get('*', function (req, res) {
    res.send('JORE 404 !', 404);
});
module.exports = router;