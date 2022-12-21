
const exphbs = require("express-handlebars"),
  path = require("path");

module.exports = (app) => {
  app.engine(
    "hbs",
    exphbs.engine({
      layoutsDir: "Source/views/layouts",
      defaultLayout: "main_candidate_not_login.hbs",
      extname: ".hbs",
    })
  );
  app.set("view engine", "hbs");
  app.set("views", path.join(__dirname, "/../views"));
};