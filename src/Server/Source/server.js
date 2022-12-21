const express = require("express");
const path = require("path");
const bodyParser = require("./config/bodyParser");
const hbs = require("./config/hbs");
const session = require("express-session");
const route = require("./routers");
const flush = require("connect-flash");
const passport = require("./app/middlewares/passport");

// port number
const port = 3032;

// init application
const app = express();

// Set dung tai nguyen he thong
app.use(express.static(path.join(__dirname + "/public")));

require("./config/hbs")(app);

// session
app.use(
  session({
    secret: "anything",
    resave: false,
    saveUninitialized: false,
  })
);


// flash messages
app.use(flush());

// bodyparser
bodyParser(app);

// handlebars
hbs(app);

//passport
//passport(app);

// router
route(app);


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
