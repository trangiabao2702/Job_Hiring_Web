class General_Homepage {
  home(req, res) {
    if (req.isAuthenticated()) {
      var user = req.session.passport.user;

      res.render("candidate/content_home.hbs", {
        layout: "main_candidate_login",
        data: {
          user: user,
        },
        not_record: true,
      });
    } else {
      res.render("general/general_homepage.hbs");
    }
  }
}

module.exports = new General_Homepage();
