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
            async function verify(accessToken, refreshToken, profile, cb) {

                // Check if google profile exist.
                if (profile.id) {
                    let user = {};
                    user.idGoogle = profile.id;
                    user.email = profile.emails[0].value;
                    user.name = profile.displayName;
                    user.given_name = profile.name.givenName;
                    user.familyName = profile.name.familyName;
                    user.state = 'google';
                    user.avatar = profile.photos[0].value;

                    user = await candidateModel.addACandidate(user);
                    user = await candidateModel.getByEmail(profile.emails[0].value);
                    //console.log(user);
                    return cb(null, user);

                }
            }

        )
    );

}
