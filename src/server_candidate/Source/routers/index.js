const siteRouter = require("./site.r");


const candidateRouter = require("./candidate.r");
const authRouter = require("./auth.r");
const general_hompage = require('../app/controllers/general_homepage.c');

function router(app) {
  //app.use('/', siteRouter);
  app.use("/auth", authRouter);
  app.use("/candidate", candidateRouter);
  app.use("/",general_hompage.home);
}

module.exports = router;


