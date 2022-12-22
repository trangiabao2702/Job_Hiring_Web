const employerRouter = require("./employer.r");

function router(app) {
  app.use("/employer", employerRouter);
}

module.exports = router;
