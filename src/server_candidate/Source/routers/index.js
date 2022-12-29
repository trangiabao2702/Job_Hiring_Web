const siteRouter = require("./site.r");


const candidateRouter = require("./candidate.r");
const authRouter = require("./auth.r");
const CandidaterController = require("../app/controllers/candidate.c");

function router(app) {
  //app.use('/', siteRouter);
  app.use("/auth", authRouter);
  app.use("/candidate", candidateRouter);
  app.use("/",CandidaterController.home);
}

module.exports = router;


