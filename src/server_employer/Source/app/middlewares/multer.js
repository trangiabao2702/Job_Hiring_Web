const multer = require('multer')
const fs = require('fs');

var storage = multer.memoryStorage();
const upload = multer({ storage: storage });
module.exports = upload;