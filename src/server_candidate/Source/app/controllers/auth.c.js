const firebase = require('../../config/firebase');

exports.signup = (req, res, next) => {

    firebase
        .auth()
        .createUserWithEmailAndPassword(req.body.email, req.body.password)
        .then((data) => {
            return res.status(200).json(data);
        })
        .catch(function (err) {
            return res.status(500);
        })
}

exports.signin = (req, res, next) => {

    firebase
        .auth()
        .createUserWithEmailAndPassword(req.body.email, req.body.password)
        .then((data) => {
            return res.status(200).json(data);
        })
        .catch(function (err) {
            return res.status(500);
        })
}

exports.forgetPassword = (req, res, next) => {

    firebase
        .auth()
        .createUserWithEmailAndPassword(req.body.email, req.body.password)
        .then((data) => {
            return res.status(200).json(data);
        })
        .catch(function (err) {
            return res.status(500);
        })
}