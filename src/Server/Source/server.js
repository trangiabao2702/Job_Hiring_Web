const express = require("express");
const path = require("path");
const bodyParser = require("./config/bodyParser");
const session = require("express-session");
const route = require("./routers/index");
const flush = require("connect-flash");
const passport = require("./app/middlewares/passport");

// port number
const port = 3032;

// init application
const app = express();

// Set dung tai nguyen he thong
app.use(express.static(path.join(__dirname + "/public")));

// session
app.use(
  session({
    secret: "anything",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flush());

// bodyparser
bodyParser(app);

//passport
//passport(app);

// router
route(app);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
