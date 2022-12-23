//const employerModel = require("../models/employer.m");

class AuthController{


    sign_in(req, res, next) {
      res.render("content_admin/sign_in", {
        layout: "main_admin_not_login",
      });
    }

    // [POST] /sign_out
    postSignOut(req, res, next) {
        try {
            if (req.isAuthenticated()) {
                req.logout(err => {
                    if (err) {
                        return next(err);
                    }
                })
            }
            res.redirect('/auth/sign_in');
        } catch (error) {
            next(error);
        }
    }

  }
  
  module.exports = new AuthController();
  