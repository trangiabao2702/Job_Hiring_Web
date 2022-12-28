const express = require("express");
const router = express.Router();

const employerController = require("../app/controllers/employer.c");

router.get("/homepage", employerController.homepage);
router.get("/profile", employerController.profile);
// router.get("/edit_profile", employerController.edit_profile);
router.get("/list_rating", employerController.list_rating);

router.get("/manage_candidates_cvs", employerController.manage_candidates_cvs);
router.get("/detail_cv_candidate", employerController.detail_cv_candidate);
router.get("/profile_candidate", employerController.profile_candidate);
router.post("/post_detail_cv_candidate", employerController.post_detail_cv_candidate);

router.get("/manage_recruitments", employerController.manage_recruitments);
router.get("/detail_recruitment", employerController.detail_recruitment);
router.post("/post_detail_recruitment", employerController.post_detail_recruitment);
router.get("/add_recruitment", employerController.add_recruitment);
router.post("/post_add_recruitment", employerController.post_add_recruitment);
router.get("/edit_recruitment", employerController.edit_recruitment);
router.post("/post_edit_recruitment", employerController.post_edit_recruitment);

router.get("/", employerController.homepage);

module.exports = router;
