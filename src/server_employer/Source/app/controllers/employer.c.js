const employerModel = require("../models/employer.m");

class EmployerController {
  // [GET] /homepage
  async homepage(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        // get information of employer
        const _employer = req.session.passport.user;
        // const _email = "employer_kms@gmail.com";
        // const _employer = await employerModel.getEmployerByEmail(_email);

        // calculate the total number of candidates and the number of approved candidates
        let total_candidates = 0;
        let approved_candidates = 0;
        let denied_candidates = 0;

        for (const id_recruitment of _employer.list_recruitments) {
          const _recruitment = await employerModel.getRecruitmentByID(id_recruitment);

          total_candidates += _recruitment.list_cvs.length;
          for (const id_cv of _recruitment.list_cvs) {
            const _cv = await employerModel.getCVByID(id_cv);
            if (_cv.status == "approved") {
              approved_candidates += 1;
            } else if (_cv == "denied") {
              denied_candidates += 1;
            } else {
            }
          }
        }

        res.render("contents/homepage", {
          layout: "main_employer_login",
          data: {
            user: _employer,
          },
          number_of_recruitments: _employer.list_recruitments.length,
          number_of_approved_candidates: approved_candidates,
          number_of_new_candidates: total_candidates - approved_candidates,
        });
      } else {
        res.redirect("/auth/sign_in");
      }
    } catch (error) {
      next(error);
    }
  }

  // [GET] /manage_recruitments
  manage_recruitments(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        // get information of employer
        const _employer = req.session.passport.user;

        // TODO

        res.render("contents/manage_recruitments", {
          layout: "main_employer_login",
          data: {
            user: _employer,
          },
          number_of_recruitments: _employer.list_recruitments.length,
          number_of_approved_candidates: approved_candidates,
          number_of_new_candidates: total_candidates - approved_candidates,
        });
      } else {
        res.redirect("/auth/sign_in");
      }
    } catch (error) {
      next(error);
    }
  }

  // [GET] /detail_recruitment
  detail_recruitment(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        // get information of employer
        const _employer = req.session.passport.user;

        // TODO

        res.render("contents/detail_recruitment", {
          layout: "main_employer_login",
          data: {
            user: _employer,
          },
          number_of_recruitments: _employer.list_recruitments.length,
          number_of_approved_candidates: approved_candidates,
          number_of_new_candidates: total_candidates - approved_candidates,
        });
      } else {
        res.redirect("/auth/sign_in");
      }
    } catch (error) {
      next(error);
    }
  }

  // [GET] /edit_recruitment
  edit_recruitment(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        // get information of employer
        const _employer = req.session.passport.user;

        // TODO

        res.render("contents/edit_recruitment", {
          layout: "main_employer_login",
          data: {
            user: _employer,
          },
          number_of_recruitments: _employer.list_recruitments.length,
          number_of_approved_candidates: approved_candidates,
          number_of_new_candidates: total_candidates - approved_candidates,
        });
      } else {
        res.redirect("/auth/sign_in");
      }
    } catch (error) {
      next(error);
    }
  }

  // [GET] /manage_candidates_cvs
  manage_candidates_cvs(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        // get information of employer
        const _employer = req.session.passport.user;

        // TODO

        res.render("contents/manage_candidates_cvs", {
          layout: "main_employer_login",
          data: {
            user: _employer,
          },
          number_of_recruitments: _employer.list_recruitments.length,
          number_of_approved_candidates: approved_candidates,
          number_of_new_candidates: total_candidates - approved_candidates,
        });
      } else {
        res.redirect("/auth/sign_in");
      }
    } catch (error) {
      next(error);
    }
  }

  // [GET] /detail_candidate
  detail_candidate(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        // get information of employer
        const _employer = req.session.passport.user;

        // TODO

        res.render("contents/detail_candidate", {
          layout: "main_employer_login",
          data: {
            user: _employer,
          },
          number_of_recruitments: _employer.list_recruitments.length,
          number_of_approved_candidates: approved_candidates,
          number_of_new_candidates: total_candidates - approved_candidates,
        });
      } else {
        res.redirect("/auth/sign_in");
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmployerController();
