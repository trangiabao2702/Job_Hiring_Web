const employerModel = require("../models/employer.m");

class EmployerController {
  // [GET] /sign_up
  sign_up(req, res, next) {
    res.render("contents/sign_up", {
      layout: "main_employer_not_login",
    });
  }

  // [GET] /sign_in
  sign_in(req, res, next) {
    res.render("contents/sign_in", {
      layout: "main_employer_not_login",
    });
  }

  // [GET] /forgot_pw
  forgot_pw(req, res, next) {
    res.render("contents/forgot_pw", {
      layout: "main_employer_not_login",
    });
  }

  // [GET] /account_authentication
  account_authentication(req, res, next) {
    res.render("contents/account_authentication", {
      layout: "main_employer_not_login",
    });
  }

  // [GET] /reset_pw
  reset_pw(req, res, next) {
    res.render("contents/reset_pw", {
      layout: "main_employer_not_login",
    });
  }

  // [GET] /homepage
  homepage(req, res, next) {
    res.render("contents/homepage", {
      layout: "main_employer_login",
    });
  }

  // [GET] /manage_recruitments
  manage_recruitments(req, res, next) {
    res.render("contents/manage_recruitments", {
      layout: "main_employer_login",
    });
  }

  // [GET] /detail_recruitment
  detail_recruitment(req, res, next) {
    res.render("contents/detail_recruitment", {
      layout: "main_employer_login",
    });
  }

  // [GET] /edit_recruitment
  edit_recruitment(req, res, next) {
    res.render("contents/edit_recruitment", {
      layout: "main_employer_login",
    });
  }

  // [GET] /manage_candidates_cvs
  manage_candidates_cvs(req, res, next) {
    res.render("contents/manage_candidates_cvs", {
      layout: "main_employer_login",
    });
  }

  // [GET] /detail_candidate
  detail_candidate(req, res, next) {
    res.render("contents/detail_candidate", {
      layout: "main_employer_login",
    });
  }
}

module.exports = new EmployerController();
