const employerModel = require("../models/employer.m");

class EmployerController {

    // [GET] /homepage
    homepage(req, res, next) {
        try {
            if (req.isAuthenticated()) {
                var user = req.session.passport.user;

                res.render("contents/homepage", {
                    layout: "main_employer_login",
                    data: {
                        user: user
                    }
                });
            } else {
                res.redirect('/auth/sign_in');
            }

        } catch (error) {
            next(error);
        }

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
