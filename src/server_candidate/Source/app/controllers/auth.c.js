
const bcrypt = require('bcrypt');
const saltRounds = 10;
const candidateModel = require('../models/candidate.m');


class Authencation {

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

            res.render('candidate/content_signup.hbs', { message: req.flash('message'), messageDanger: req.flash('messageDanger') });
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


    // [POST] /signup
    async postSignup(req, res, next) {

        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const salt = bcrypt.genSaltSync(saltRounds);
        const pwHashed = bcrypt.hashSync(password, salt);

        const user = {
            name: name,
            email: email,
            password: pwHashed,
            avatar: null,
            state: 'login'
        }

        const userNew = await candidateModel.addACandidate(user);

        if (userNew) {
            req.flash('message', 'Đăng ký thành công')
            res.redirect('/auth/login');
        } else {

            req.flash('messageDanger', 'Tài khoản đã tồn tại')
            res.redirect('/auth/signup');
        }
    }

    // [POST] /login
    async postLogin(req, res, next) {
        try {

        } catch (error) {
            next(error);
        }
    }

    // [POST]/logout
    postLogout(req, res, next) {
        if (req.isAuthenticated()) {
            req.logout(err => {
                if (err) {
                    return next(err);
                }
            })
        }
        res.redirect('/auth/login');
    }

}

module.exports = new Authencation();













// const firebase = require('../../config/firebase');

// exports.signup = (req, res, next) => {

//     firebase
//         .auth()
//         .createUserWithEmailAndPassword(req.body.email, req.body.password)
//         .then((data) => {
//             return res.status(200).json(data);
//         })
//         .catch(function (err) {
//             return res.status(500);
//         })
// }

// exports.signin = (req, res, next) => {

//     firebase
//         .auth()
//         .createUserWithEmailAndPassword(req.body.email, req.body.password)
//         .then((data) => {
//             return res.status(200).json(data);
//         })
//         .catch(function (err) {
//             return res.status(500);
//         })
// }

// exports.forgetPassword = (req, res, next) => {

//     firebase
//         .auth()
//         .createUserWithEmailAndPassword(req.body.email, req.body.password)
//         .then((data) => {
//             return res.status(200).json(data);
//         })
//         .catch(function (err) {
//             return res.status(500);
//         })
// }