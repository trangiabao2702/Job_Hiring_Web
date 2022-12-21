//const employerModel = require("../models/employer.m");

class EmployerController {
  // [GET] /register
  sign_up(req, res) {
    res.render("content_employer/sign_up");
  }
}

module.exports = new EmployerController();
