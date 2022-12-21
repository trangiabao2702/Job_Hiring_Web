const bcrypt = require('bcrypt');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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

    passport.use(
        new GoogleStrategy(
            {
                clientID: '937613699644-5qq1gd3kji3isuij0c1gcbkkt6eu4v7b.apps.googleusercontent.com',
                clientSecret: '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',
                callbackURL: '/candidate/auth/google/callback',
                scope: ['profile', 'email'],
                state: true
            },
            function verify(accessToken, refreshToken, profile, cb) {

                // Check if google profile exist.
                if (profile.id) {
                    let user = {};
                    user.email = profile.emails[0].value;
                    user.password = 'google';
                    user.name = profile.name;

                    //console.log(user);
                    return cb(null, user);

                }
            }

        )
    );

}
