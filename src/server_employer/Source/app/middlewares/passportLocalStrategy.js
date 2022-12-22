const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
// const candidateModel = require('../models/candidate.m');

module.exports = (app) => {
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
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await userModel.getByUserName(email);
          if (!user) {
            return done(null, false);
          }
          const cmp = await bcrypt.compare(password, user.f_Password);
          if (!cmp) {
            return done(null, false, { messageDanger: "Password entered is incorrect." });
          }
          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
};
