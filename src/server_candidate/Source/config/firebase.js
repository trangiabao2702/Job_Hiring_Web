// const firebase = require('firebase/app');
// require('firebase/auth');
// require('firebase/firestore');



// const firebaseConfig = {
//   apiKey: "AIzaSyC3EUslLpyo3xbwRpBH-4W6oW9WivW22SI",
//   authDomain: "jobhiringweb.firebaseapp.com",
//   projectId: "jobhiringweb",
//   storageBucket: "jobhiringweb.appspot.com",
//   messagingSenderId: "239332986540",
//   appId: "1:239332986540:web:2cbe0028b6b2a50f2d9909",
//   measurementId: "G-HVV5GJ7XWD"
// };

// firebase.initializeApp(firebaseConfig);
// module.exports = firebase;


var admin = require("firebase-admin");

var serviceAccount = require("../../jobhiringweb-firebase-adminsdk-3v7e1-b9a54f2803.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;