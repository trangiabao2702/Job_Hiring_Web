const employerRouter = require("./employer.r");
const authRouter = require("./auth.r");
const siteRouter = require("./site.r");

function router(app) {
  app.use('/', siteRouter);
  app.use('/auth', authRouter);
  app.use("/employer", employerRouter);
}

module.exports = router;
