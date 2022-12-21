const employerRouter = require("./employer.r");
const siteRouter = require("./site.r");


function router(app) {
  app.use('/', siteRouter);
  app.use("/employer", employerRouter);
}

module.exports = router;
