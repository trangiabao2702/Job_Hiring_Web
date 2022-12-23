const bcrypt = require('bcrypt');
const saltRounds = 10;
const candidateModel = require('../models/candidate.m');


class Candidate {
    async home(req, res, next) {


        try {
            if (req.isAuthenticated()) {
                var user = req.session.passport.user;
                var topJob = await candidateModel.topJob(6);
                res.render('candidate/content_home.hbs', {
                    layout: 'main_candidate_login',
                    data: {
                        user: user
                    },
                    topJob,
                    not_record: true

                });
            } else {
                res.redirect('/auth/login');
            }
        }
        catch (error) {
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
                res.render('candidate/content_detail_job.hbs', {

                    layout: 'main_candidate_login',
                    data: {
                        user: user,
                        recruitment: recruitment,
                        belongEmployer: belongEmployer,
                        idDocRecruitment: idDocRecruitment,
                        isApplied: checkApplied
                    },
                    not_record: true


                });
            } else {
                res.redirect('/auth/login');
            }
        } catch (error) {
            next(error);
        }


    }
    manage_record(req, res, next) {
        var user = req.session.passport.user;

        res.render('candidate/content_manage_record.hbs', {
            layout: 'main_candidate_login', data: {
                user: user
            }
        });

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
                curriculumVitae = {id_candidate, ...curriculumVitae};
                curriculumVitae.status = 'pending';
                const uploadCv = await candidateModel.uploadCurriculumVitae(curriculumVitae, req.file);

                res.redirect('back');

            } else {
                res.redirect('/auth/login');
            }
        } catch (error) {
            next(error);
        }
    }


}

module.exports = new Candidate()