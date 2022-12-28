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

  // [GET] /profile
  async profile(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        // get information of employer
        const _employer = req.session.passport.user;

        res.render("contents/profile", {
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

  // [GET] /list_rating
  async list_rating(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        // get information of employer
        const _employer = req.session.passport.user;

        // get all rating
        let list_reviews = [];
        for (const _id_review of _employer.list_reviews) {
          let _review = await employerModel.getReviewByID(_id_review);
          const _belong_to = await employerModel.getCandidateByID(_review.belong_candidate);
          _review.name_candidate = _belong_to.name;
          _review.avatar_candidate = _belong_to.avatar;

          list_reviews.push(_review);
        }

        res.render("contents/list_rating", {
          layout: "main_employer_login",
          data: {
            user: _employer,
            list_rating: JSON.stringify(list_reviews),
          },
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
  async post_detail_recruitment(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        // get information of employer
        const _employer = req.session.passport.user;

        // check type of post method then redirect to correct page
        if (req.body.post_type == "Chỉnh sửa") {
          res.redirect("/employer/edit_recruitment?id=" + req.body.id_recruitment);
        } else if (req.body.post_type == "Xóa") {
          const _id_remove_recruitment = await employerModel.removeRecruitment(req.body.id_recruitment);
          const _update_list_recruitment_of_employer = await employerModel.updateListRecruitment(_employer.id, _id_remove_recruitment, "remove");
          req.session.passport.user.list_recruitments.slice(_employer.list_recruitments.indexOf(_id_remove_recruitment), 1);

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
  async post_add_recruitment(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        // get information of employer
        const _employer = req.session.passport.user;
        // const _current_date = new Date().getTime();
        const _current_date = require("firebase-admin").firestore.Timestamp.fromDate(new Date());
        const _date_path = req.body.deadline_submit_record_recruitment.split("-");
        const _due_date = require("firebase-admin").firestore.Timestamp.fromDate(new Date(parseInt(_date_path[0]), parseInt(_date_path[1]) - 1, parseInt(_date_path[2])));

        // create new recruitment
        const _new_recruitment = {
          belong_employer: _employer.id,
          benefits: req.body.benefit_recruitment,
          creation_date: _current_date,
          description: req.body.job_describe_recruitment,
          due_date: _due_date,
          experience: req.body.experience_recruitment,
          gender: req.body.sex_recruitment,
          list_cvs: [],
          location: req.body.word_location_recruitment,
          max_salary: req.body.max_salary_recruitment,
          min_salary: req.body.min_salary_recruitment,
          number_of_candidates: req.body.quantity_recruitment,
          requirements: req.body.require_candidate_recruitment,
          status: "pending",
          title: req.body.title_recruitment,
          views: 0,
          working_form: req.body.method_work_recruitment,
        };

        // add new recruitment to db
        const _add_new_recruitment = await employerModel.addRecruitment(_new_recruitment);
        const _update_list_recruitment_of_employer = await employerModel.updateListRecruitment(_employer.id, _add_new_recruitment.id, "add");
        req.session.passport.user.list_recruitments.push(_add_new_recruitment.id);

        res.redirect("/employer/manage_recruitments");
      } else {
        res.redirect("/auth/sign_in");
      }
    } catch (error) {
      next(error);
    }
  }

  // [GET] /edit_recruitment
  async edit_recruitment(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        // get information of employer
        const _employer = req.session.passport.user;

        // get information of recruitment
        const _recruitment = await employerModel.getRecruitmentByID(req.query.id);

        res.render("contents/edit_recruitment", {
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

  // [POST] /post_edit_recruitment
  async post_edit_recruitment(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        // get information of employer
        const _employer = req.session.passport.user;

        // update information of recruitment
        const _id_recruitment = await employerModel.updateRecruitment(req.body);

        res.redirect("/employer/detail_recruitment?id=" + req.body.id_recruitment);
      } else {
        res.redirect("/auth/sign_in");
      }
    } catch (error) {
      next(error);
    }
  }

  // [GET] /manage_candidates_cvs
  async manage_candidates_cvs(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        // get information of employer
        const _employer = req.session.passport.user;

        // get all csv by id of recruitment
        const _id_recruitment = req.query.id_recruitment;
        const _list_cvs = await employerModel.getCVsByIDRecruitment(_id_recruitment);
        let _candidate_cvs = [];
        let _index = 0;
        _list_cvs.forEach((doc) => {
          _candidate_cvs.push(doc.data());
          _candidate_cvs[_index].id_cv = doc.id;
          _index += 1;
        });

        res.render("contents/manage_candidates_cvs", {
          layout: "main_employer_login",
          data: {
            user: _employer,
            list_cvs: JSON.stringify(_candidate_cvs),
          },
        });
      } else {
        res.redirect("/auth/sign_in");
      }
    } catch (error) {
      next(error);
    }
  }

  // [GET] /detail_cv_candidate
  async detail_cv_candidate(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        // get information of employer
        const _employer = req.session.passport.user;

        // get information of cv
        const _id_cv = req.query.id_cv_candidate;
        const _info_cv = await employerModel.getCVByID(_id_cv);
        const _info_candidate = await employerModel.getCandidateByID(_info_cv.id_candidate);
        _info_cv.avatar_candidate = _info_candidate.avatar;
        _info_cv.id = _id_cv;

        res.render("contents/detail_cv_candidate", {
          layout: "main_employer_login",
          data: {
            user: _employer,
            cv: JSON.stringify(_info_cv),
          },
        });
      } else {
        res.redirect("/auth/sign_in");
      }
    } catch (error) {
      next(error);
    }
  }

  // [GET] /profile_candidate          // is this need to do????
  async profile_candidate(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        // get information of employer
        const _employer = req.session.passport.user;

        // get information of candidate
        // TODO

        res.render("contents/profile_candidate", {
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

  // [GET] /post_detail_cv_candidate
  async post_detail_cv_candidate(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        // get information of employer
        const _employer = req.session.passport.user;

        // get status of cv
        const _status_cv = req.body.approved_cv;
        const _id_cv = req.body.id_cv;
        let _new_status = "denied";
        if (_status_cv != "") {
          _new_status = "approved";
        }

        // update status of cv
        const _update_status_cv = await employerModel.updateStatusCV(_id_cv, _new_status);

        res.redirect("/employer/manage_candidates_cvs?id_recruitment=" + _update_status_cv);
      } else {
        res.redirect("/auth/sign_in");
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmployerController();
