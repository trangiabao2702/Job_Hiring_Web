const bcrypt = require('bcrypt');
const saltRounds = 10;
const candidateModel = require('../models/candidate.m');


class Candidate {
    home(req, res, next) {


        try {
            if (req.isAuthenticated()) {
                var user = req.session.passport.user;

                res.render('candidate/content_home.hbs', {
                    layout: 'main_candidate_login',
                    data: {
                        user: user
                    }
                });
            } else {
                res.redirect('/auth/login');
            }
        }
        catch (error) {
            next(error);
        }

    }
    detail_job(req, res, next) {
        res.render('candidate/content_detail_job.hbs', {
            layout: 'main_candidate_login'
        });

    }
    manage_record(req, res, next) {
        res.render('candidate/content_manage_record.hbs', {
            layout: 'main_candidate_login'
        });

    }


}

module.exports = new Candidate()