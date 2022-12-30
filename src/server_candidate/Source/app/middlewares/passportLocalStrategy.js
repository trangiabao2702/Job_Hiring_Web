const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const candidateModel = require('../models/candidate.m');

module.exports = app => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    passport.deserializeUser(async function (user, done) {
        try {
            //const user = await userModel.getByUserName(username);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });

    passport.use(new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email',
        passwordField: 'password',
    },
        async (req, email, password, done) => {
            try {
                const user = await candidateModel.getUserByEmailLogin(email);
                if (!user) { return done(null, false); }
                const cmp = await bcrypt.compare(password, user.password);
                if (!cmp) {
                    return done(null, false,  req.flash('messageDanger', 'Sai tài khoản hoặc mật khẩu!'));
                }
                return done(null, user);
            } catch (error) {
                done(error);
            }
        }
    ));

}
