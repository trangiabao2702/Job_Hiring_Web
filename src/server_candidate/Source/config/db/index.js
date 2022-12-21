
var admin = require("firebase-admin");

var serviceAccount = require("../../../jobhiringweb-firebase-adminsdk-3v7e1-b9a54f2803.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;