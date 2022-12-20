const bodyParser = require("body-parser");


module.exports = app => {
    // parser du lieu
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
}