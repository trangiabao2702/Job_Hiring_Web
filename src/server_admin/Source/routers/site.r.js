const express = require('express');
const SiteController = require('../app/controllers/site.c');
const router = express.Router();

router.get('/', SiteController.index);

module.exports = router;