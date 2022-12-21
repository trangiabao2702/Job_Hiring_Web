const express = require("express");
const router = express.Router();

const employerController = require("../app/controllers/employer.c");

router.use("/sign_up", employerController.sign_up);

module.exports = router;
