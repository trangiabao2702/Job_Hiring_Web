const bcrypt = require("bcrypt");
const saltRounds = 10;
const candidateModel = require("../models/candidate.m");

class Candidate {
  async home(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        var user = req.session.passport.user;
        var topJob = await candidateModel.topJob(6);
        res.render("candidate/content_home.hbs", {
          layout: "main_candidate_login",
          data: {
            user: user,
          },
          topJob,
          not_record: true,
        });
      } else {
        res.redirect("/auth/login");
      }
    } catch (error) {
      next(error);
    }
  }
  async detail_job(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        var user = req.session.passport.user;
        var idDocRecruitment = req.params.id;
        const id_candidate = await candidateModel.getIDDocumentCandidates(user.email);
        var recruitment = await candidateModel.getRecruitment(idDocRecruitment);
        var belongEmployer = await candidateModel.getEmployer(recruitment.belong_employer);
        const checkApplied = await candidateModel.checkApplied(idDocRecruitment, id_candidate);

        console.log(checkApplied);
        res.render("candidate/content_detail_job.hbs", {
          layout: "main_candidate_login",
          data: {
            user: user,
            recruitment: recruitment,
            belongEmployer: belongEmployer,
            idDocRecruitment: idDocRecruitment,
            isApplied: checkApplied,
          },
          not_record: true,
        });
      } else {
        res.redirect("/auth/login");
      }
    } catch (error) {
      next(error);
    }
  }
  async manage_record(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        var user = req.session.passport.user;
        const _list_cvs = await candidateModel.getAllCV(user.id);
        let docList = [];
        _list_cvs.forEach((doc) => docList.push(doc));

        let _candidate_cvs = [];
        let _index = 0;

        for (const doc of docList) {
          const _detail_recruitment = await candidateModel.getDetailRecruitment(doc.data().id_recruitment);
          const _info_employer = await candidateModel.getEmployer(_detail_recruitment.belong_employer);

          _candidate_cvs.push(doc.data());
          _candidate_cvs[_index].avatar_employer = _info_employer.avatar;
          _candidate_cvs[_index].name_employer = _info_employer.name;
          _candidate_cvs[_index].title_recruitment = _detail_recruitment.title;
          _candidate_cvs[_index].id_cv = doc.id;
          _index += 1;
        }

        res.render("candidate/content_manage_record.hbs", {
          layout: "main_candidate_login",
          data: {
            user: user,
            list_cvs: JSON.stringify(_candidate_cvs),
          },
        });
      } else {
        res.redirect("/auth/login");
      }
    } catch (error) {
      next(error);
    }
  }
  postSearchJob(req, res, next) {
    //  var user = req.session.passport.user;
    console.log(req.body);

    if (req.body.search != "") {
    }
    // res.render('candidate/content_manage_record.hbs', {
    //     layout: 'main_candidate_login',  data: {
    //         user: user
    //     }
    // });
  }
  async uploadCV(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        var user = req.session.passport.user;

        var curriculumVitae = req.body;
        const id_candidate = await candidateModel.getIDDocumentCandidates(user.email);
        curriculumVitae = { id_candidate, ...curriculumVitae };
        curriculumVitae.status = "pending";
        const uploadCv = await candidateModel.uploadCurriculumVitae(curriculumVitae, req.file);

        res.redirect("back");
      } else {
        res.redirect("/auth/login");
      }
    } catch (error) {
      next(error);
    }
  }
  async detail_cv(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        var user = req.session.passport.user;

        // get information of cv
        const _id_cv = req.query.id_cv;
        const _info_cv = await candidateModel.getCVByID(_id_cv);
        _info_cv.avatar_candidate = user.avatar;

        res.render("candidate/content_detail_cv.hbs", {
          layout: "main_candidate_login",
          data: {
            user: user,
            cv: JSON.stringify(_info_cv),
          },
        });
      } else {
        res.redirect("/auth/login");
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Candidate();
