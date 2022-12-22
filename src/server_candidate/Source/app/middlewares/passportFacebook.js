const bcrypt = require('bcrypt');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
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


    passport.use(new FacebookStrategy({
        clientID: "5424872314284787",
        clientSecret: "6017d639a58b2c070cbdeccd24a4065d",
        callbackURL: "/candidate/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'email', 'name', 'gender','photos']
      },
      async function(accessToken, refreshToken, profile, cb) {
        
        if (profile.id) {
            let user = {};
            user.idFacebook = profile.id;
            user.email = profile.emails[0].value;
            user.name = profile.displayName;
            user.given_name = profile.name.givenName;
            user.familyName = profile.name.familyName;
            user.state = 'facebook';
            user.avatar = profile.photos[0].value;

            await candidateModel.addACandidateFacebook(user);
            user = await candidateModel.getUserByIDFacebook(profile.id);
            //console.log(user);
            return cb(null, user);

        }

      }
    ));

}
