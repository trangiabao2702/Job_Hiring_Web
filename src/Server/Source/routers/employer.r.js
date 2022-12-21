const express = require("express");
const router = express.Router();

const employerController = require("../app/controllers/employer.c");

router.use("/sign_up", employerController.sign_up);
router.use("/sign_in", employerController.sign_in);
router.use("/forgot_pw", employerController.forgot_pw);
router.use("/account_authentication", employerController.account_authentication);
router.use("/reset_pw", employerController.reset_pw);
router.use("/homepage", employerController.homepage);
router.use("/manage_recruitments", employerController.manage_recruitments);
router.use("/detail_recruitment", employerController.detail_recruitment);
router.use("/edit_recruitment", employerController.edit_recruitment);
router.use("/manage_candidates_cvs", employerController.manage_candidates_cvs);
router.use("/detail_candidate", employerController.detail_candidate);

router.use("/", employerController.homepage);

module.exports = router;
