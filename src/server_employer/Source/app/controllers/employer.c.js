const employerModel = require("../models/employer.m");

class EmployerController {
  // [GET] /homepage
  async homepage(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        // get information of employer
        const _employer = req.session.passport.user;

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
  async manage_recruitments(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        // get information of employer
        const _employer = req.session.passport.user;

        // get list of recruitments
        let _recruitments = [];
        for (const id_recruitment of _employer.list_recruitments) {
          const _recruitment = await employerModel.getRecruitmentByID(id_recruitment);
          _recruitments.push(_recruitment);
        }

        res.render("contents/manage_recruitments", {
          layout: "main_employer_login",
          data: {
            user: _employer,
            list_recruitments: JSON.stringify(_recruitments),
            id_recruitments: JSON.stringify(_employer.list_recruitments),
          },
        });
      } else {
        res.redirect("/auth/sign_in");
      }
    } catch (error) {
      next(error);
    }
  }

  // [GET] /detail_recruitment
  async detail_recruitment(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        // get information of employer
        const _employer = req.session.passport.user;

        // get information of recruitment
        const _recruitment = await employerModel.getRecruitmentByID(req.query.id);

        res.render("contents/detail_recruitment", {
          layout: "main_employer_login",
          data: {
            user: _employer,
            recruitment: JSON.stringify(_recruitment),
          },
        });
      } else {
        res.redirect("/auth/sign_in");
      }
    } catch (error) {
      next(error);
    }
  }

  // [POST] /post_detail_recruitment
  post_detail_recruitment(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        // get information of employer
        const _employer = req.session.passport.user;

        // check type of post method then redirect to correct page
        if (req.body.post_type == "Chỉnh sửa") {
          res.redirect("/employer/detail_recruitment?id=" + req.body.id_recruitment);
        } else if (req.body.post_type == "Xóa") {
          res.redirect("/employer/manage_recruitments");
        } else if (req.body.post_type == "Danh sách ứng viên") {
          res.redirect("/employer/manage_candidates_cvs?id_recruitment=" + req.body.id_recruitment);
        } else {
          // do nothing
        }
      } else {
        res.redirect("/auth/sign_in");
      }
    } catch (error) {
      next(error);
    }
  }

  // [GET] /add_recruitment
  add_recruitment(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        // get information of employer
        const _employer = req.session.passport.user;

        res.render("contents/add_recruitment", {
          layout: "main_employer_login",
          data: {
            user: _employer,
          },
        });
      } else {
        res.redirect("/auth/sign_in");
      }
    } catch (error) {
      next(error);
    }
  }

  // [POST] /post_add_recruitment
  post_add_recruitment(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        // get information of employer
        const _employer = req.session.passport.user;
        console.log(req.body);
        res.redirect("/employer/manage_recruitments");
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
