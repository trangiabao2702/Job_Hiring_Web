const express = require("express");
const router = express.Router();

const admin = require("../app/controllers/admin");

router.get("/sign_in", admin.sign_in);
router.get("/forgot_pw", admin.forgot_pw);
router.get("/account_authentication", admin.account_authentication);
router.get("/reset_pw", admin.reset_pw);
router.get("/manage_account/list_account_approved", admin.list_account_appvoved);
router.get("/manage_account/list_account_pending", admin.list_account_pending);
router.get("/manage_account/list_account_locked", admin.list_account_locked);
router.get("/manage_account/detail_account", admin.detail_account);

router.get("/manage_news/list_news_approved", admin.list_news_approved);
router.get("/manage_news/list_news_pending", admin.list_news_pending);
router.get("/manage_news/detail_news", admin.detail_news);

router.get("/manage_account", admin.manage_account);
router.get("/manage_news", admin.manage_news);

router.get("/", admin.homepage);

module.exports = router;
