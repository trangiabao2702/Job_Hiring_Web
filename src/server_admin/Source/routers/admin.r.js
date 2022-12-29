const express = require("express");
const router = express.Router();

const admin = require("../app/controllers/admin.c");

router.get("/manage_account/list_account_approved", admin.list_account_appvoved);
router.get("/manage_account/list_account_pending", admin.list_account_pending);
router.get("/manage_account/list_account_locked", admin.list_account_locked);
router.get("/manage_account/detail_account", admin.detail_account);

router.get("/manage_news/list_news_approved", admin.list_news_approved);
router.get("/manage_news/list_news_pending", admin.list_news_pending);
router.get("/manage_news/list_news_locked", admin.list_news_locked);
router.get("/manage_news/list_news_removed", admin.list_news_removed);

router.get("/manage_news/detail_news", admin.detail_news);
// router.get("/manage_news/list_candidates", admin.list_applied);

router.get("/manage_account", admin.homepage);
router.get("/manage_news", admin.manage_news);
router.get("/manage_reports", admin.manage_reports);
router.get("/list_reports", admin.list_reports);
router.post("/list_reports", admin.list_reports);
router.post("/post_list_reports", admin.post_list_reports);
router.post("/approve_account", admin.approve_account);
router.post("/lock_account", admin.lock_account);
router.post("/unlock_account", admin.unlock_account);
router.post("/delete_account", admin.delete_account);
router.post("/status_recruitment", admin.status_recruitment);

router.get("/", admin.homepage);

module.exports = router;
