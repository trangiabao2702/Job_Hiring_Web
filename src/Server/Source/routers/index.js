const userRouter = require("./user.r");
// const homeRouter = require("./home.r");
// const productRouter = require("./product.r");

function router(app) {
  app.use("/user", userRouter);
  app.use("/product", productRouter);
  app.use("/", homeRouter);
}

module.exports = router;
