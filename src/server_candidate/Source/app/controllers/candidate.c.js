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
  async postSearchJob(req, res, next) {
    console.log(req.body);
    var listjob = await candidateModel.getAllRecruitment(req.body);

    var user = req.session.passport.user;
    res.render("candidate/content_home.hbs", {
      layout: "main_candidate_login",
      data: {
        user: user,
      },
      listjob,
      not_record: true,
      length: listjob.length,
    });
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
        var _info_cv = await candidateModel.getCVByID(_id_cv);
        _info_cv.avatar_candidate = user.avatar;

        res.render("candidate/content_detail_cv.hbs", {
          layout: "main_candidate_login",
          data: {
            user: user,
            cv: JSON.stringify(_info_cv),
            not_record: true,
          },
        });
      } else {
        res.redirect("/auth/login");
      }
    } catch (error) {
      next(error);
    }
  }
  async profile_employer(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        var user = req.session.passport.user;

        // get information of employer
        const _id_employer = req.query.id ;
        const _info_employer = await candidateModel.getEmployer(_id_employer);

        let _list_recruitments = [];
        for (let i = 0; i < _info_employer.list_recruitments.length; i++) {
          _list_recruitments.push(await candidateModel.getDetailRecruitment(_info_employer.list_recruitments[i]));
          _list_recruitments[i].id = _info_employer.list_recruitments[i];
        }

        res.render("candidate/content_profile_employer.hbs", {
          layout: "main_candidate_login",
          _id_employer,
          data: {
            user: user,
            info_employer: JSON.stringify(_info_employer),
            list_recruitments: JSON.stringify(_list_recruitments),
            not_record: true,
          },
        });
      } else {
        res.redirect("/auth/login");
      }
    } catch (error) {
      next(error);
    }
  }
  async view_rating(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        var user = req.session.passport.user;

        // get information of employer
        const _id_employer = req.query.id;
        const _info_employer = await candidateModel.getEmployer(_id_employer);
       // console.log(_info_employer);
        let _list_reviews = [];
        for (let i = 0; i < _info_employer.list_reviews.length; i++) {
          _list_reviews.push(await candidateModel.getReviewByID(_info_employer.list_reviews[i]));
          _list_reviews[i].id = _info_employer.list_reviews[i];
        }
        var length=_list_reviews.length;

        res.render("candidate/content_view_rating.hbs", {
          layout: "main_candidate_login",
          length,
          _id_employer,
          data: {
            user: user,
            list_reviews: JSON.stringify(_list_reviews),
            not_record: false,
        
          },
        });
      } else {
        res.redirect("/auth/login");
      }
    } catch (error) {
      next(error);
    }
  }
  async evaluate_employer(req, res, next) {
    var star=req.body.star;
    var belong_candidate=req.session.passport.user.id;
    var id_employer=req.body.id_employer;
    var description=req.body.content;
    var evaluate={belong_candidate,description,star};
    console.log(id_employer);
    const rs=await candidateModel.addReviews(evaluate,id_employer);
    res.redirect('back');
  }
  async report_recruitment(req,res,next){
    var id_reporter=req.session.passport.user.id;
    var id_reported=req.body.id_recruitments;
    var description=req.body.content;
    var status="pending";
    var type="candidate";
    var report={description,id_reported,id_reporter,status,type};
    console.log(id_reported);
    const rs=await candidateModel.addReport(report);
    res.redirect('back');
  }
}

module.exports = new Candidate();
