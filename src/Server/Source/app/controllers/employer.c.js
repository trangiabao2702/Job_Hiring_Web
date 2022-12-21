//const employerModel = require("../models/employer.m");

class EmployerController {
  // [GET] /sign_up
  sign_up(req, res) {
    res.render("content_employer/sign_up", {
      layout: "main_employer_not_login",
    });
  }

  // [GET] /sign_in
  sign_in(req, res) {
    res.render("content_employer/sign_in", {
      layout: "main_employer_not_login",
    });
  }

  // [GET] /forgot_pw
  forgot_pw(req, res) {
    res.render("content_employer/forgot_pw", {
      layout: "main_employer_not_login",
    });
  }

  // [GET] /account_authentication
  account_authentication(req, res) {
    res.render("content_employer/account_authentication", {
      layout: "main_employer_not_login",
    });
  }

  // [GET] /reset_pw
  reset_pw(req, res) {
    res.render("content_employer/reset_pw", {
      layout: "main_employer_not_login",
    });
  }

  // [GET] /homepage
  homepage(req, res) {
    res.render("content_employer/homepage", {
      layout: "main_employer_login",
    });
  }

  // [GET] /manage_recruitments
  manage_recruitments(req, res) {
    res.render("content_employer/manage_recruitments", {
      layout: "main_employer_login",
    });
  }

  // [GET] /detail_recruitment
  detail_recruitment(req, res) {
    res.render("content_employer/detail_recruitment", {
      layout: "main_employer_login",
    });
  }

  // [GET] /edit_recruitment
  edit_recruitment(req, res) {
    res.render("content_employer/edit_recruitment", {
      layout: "main_employer_login",
    });
  }

  // [GET] /manage_candidates_cvs
  manage_candidates_cvs(req, res) {
    res.render("content_employer/manage_candidates_cvs", {
      layout: "main_employer_login",
    });
  }

  // [GET] /detail_candidate
  detail_candidate(req, res) {
    res.render("content_employer/detail_candidate", {
      layout: "main_employer_login",
    });
  }
}

module.exports = new EmployerController();
