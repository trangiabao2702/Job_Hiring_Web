const adminRouter = require("./admin.r");
const authRouter = require("./auth.r");
const siteRouter = require("./site.r");

function router(app) {
  app.use('/', siteRouter);
  app.use("/admin", adminRouter);
  app.use('/auth', authRouter);

}

module.exports = router;


