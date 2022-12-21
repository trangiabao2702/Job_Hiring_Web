const bcrypt = require('bcrypt');
const saltRounds = 10;
const candidateModel = require('../models/candidate.m');


class Candidate {
    //
    login(req, res, next) {

        try {
            res.render('candidate/content_login.hbs', { message: req.flash('message'), messageDanger: req.flash('messageDanger') });
            
        } catch (error) {
            next(error);
        }

    }
    signup(req, res, next) {
        try {
            
            res.render('candidate/content_signup.hbs',  { message: req.flash('message'), messageDanger: req.flash('messageDanger') });
        } catch (error) {
            next(error);
        }
    }
    forget_password(req, res, next) {
        res.render('candidate/content_forget_password.hbs');

    }
    authentication(req, res, next) {
        res.render('candidate/content_authentication.hbs');

    }
    reset_password(req, res, next) {
        res.render('candidate/content_reset_password.hbs');

    }
    home(req, res, next) {
        res.render('candidate/content_home.hbs', {
            layout: 'main_candidate_login'
        });

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


    // [POST] /signup
    async postSignup(req, res, next){

        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const salt = bcrypt.genSaltSync(saltRounds);
        const pwHashed = bcrypt.hashSync(password, salt);

        const user =  {
            name: name, 
            email: email,
            password: pwHashed,
            avatar: null,
        }

        const userNew = await candidateModel.addACandidate(user);

        if (userNew) {
            req.flash('message', 'Đăng ký thành công')
            res.redirect('/candidate/login');
        } else {

            req.flash('messageDanger', 'Tài khoản đã tồn tại')
            res.redirect('/candidate/signup');
        }
    }

    // [POST] /login
    async postLogin(req, res, next) {
        try {
            
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new Candidate()