//const employerModel = require("../models/employer.m");

class Admin {
  // [GET] /sign_up

  // [GET] /sign_in
  homepage(req, res, next) {
    res.render("content_admin/manage_account", {
    layout: "main_admin_login",
    });
  }
  sign_in(req, res, next) {
    res.render("content_admin/sign_in", {
      layout: "main_admin_not_login",
    });
  }
  forgot_pw(req, res, next) {
    res.render("content_admin/forgot_pw", {
      layout: "main_admin_not_login",
    });
  }
  account_authentication(req, res, next) {
    res.render("content_admin/account_authentication", {
      layout: "main_admin_not_login",
    });
  }
  reset_pw(req, res, next) {
    res.render("content_admin/reset_pw", {
      isDetailNews:true,
      layout: "main_admin_login",
    });
  }
  manage_account(req, res, next) {
    res.render("content_admin/manage_account", {
    layout: "main_admin_login",
    });
  }
  manage_news(req, res, next) {
    res.render("content_admin/manage_news", {
    layout: "main_admin_login",
    });
  }
  list_news_approved(req, res, next) {
    res.render("content_admin/list_news", {
    layout: "main_admin_login",
    });
  }
  list_news_pending(req, res, next) {
    res.render("content_admin/list_news", {
    layout: "main_admin_login",
    });
  }
  detail_news(req, res, next) {
    res.render("content_admin/detail_news", {
      isDetailNews:true,
    layout: "main_admin_login",
    });
  }
  list_account_appvoved(req, res, next) {
    res.render("content_admin/list_account", {
    layout: "main_admin_login",
    });
  }
  list_account_pending(req, res, next) {
    res.render("content_admin/list_account", {
    layout: "main_admin_login",
    });
  }
  list_account_locked(req, res, next) {
    res.render("content_admin/list_account", {
    layout: "main_admin_login",
    });
  }
  detail_account(req, res, next) {
    res.render("content_admin/detail_account", {
    layout: "main_admin_login",
    });
  }
  // [GET] /forgot_pw
  
}

module.exports = new Admin();
