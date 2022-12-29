const app = require("express");
const router = app.Router();
const CandidaterController = require("../app/controllers/candidate.c");
const upload = require("../app/middlewares/multer");

// get
router.get("/home", CandidaterController.home);
router.get("/detail_job/:id", CandidaterController.detail_job);
router.get("/manage_record", CandidaterController.manage_record);
router.get("/detail_cv", CandidaterController.detail_cv);
router.get("/profile_employer", CandidaterController.profile_employer);
router.get("/view_rating", CandidaterController.view_rating);
router.get("/profile", CandidaterController.profile);


// post
router.post("/search_job", CandidaterController.postSearchJob);
router.post("/detail_job/upload_cv", upload.single("file"), CandidaterController.uploadCV);
router.post("/evaluate_employer", CandidaterController.evaluate_employer);
router.post("/report_recruitment", CandidaterController.report_recruitment);
router.get("/", CandidaterController.home);



// 404
router.get("*", function (req, res) {
  res.send("JORE 404 !", 404);
});
module.exports = router;
