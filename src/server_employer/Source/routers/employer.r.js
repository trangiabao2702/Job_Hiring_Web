const express = require("express");
const router = express.Router();

const employerController = require("../app/controllers/employer.c");


router.get("/homepage", employerController.homepage);
router.get("/manage_recruitments", employerController.manage_recruitments);
router.get("/detail_recruitment", employerController.detail_recruitment);
router.get("/edit_recruitment", employerController.edit_recruitment);
router.get("/manage_candidates_cvs", employerController.manage_candidates_cvs);
router.get("/detail_candidate", employerController.detail_candidate);

router.get("/", employerController.homepage);

module.exports = router;
