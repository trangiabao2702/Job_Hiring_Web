const adminModel = require("../models/admin.m");

class Admin {

    // [GET] /sign_in
    async homepage(req, res, next) {
        try {
            if (req.isAuthenticated()) {
                var numberAccount=await adminModel.getNumberAccount();
                res.render("content_admin/manage_account", {
                    layout: "main_admin_login",
                    numberAccount
                });
            } else {
                res.redirect('/auth/sign_in');
            }

        } catch (error) {
            next(error);
        }

    }
    account_authentication(req, res, next) {

        try {
            if (req.isAuthenticated()) {

                res.render("content_admin/account_authentication", {
                    layout: "main_admin_not_login",
                });
            } else {
                res.redirect('/auth/sign_in');
            }

        } catch (error) {
            next(error);
        }

    }
    manage_news(req, res, next) {
        res.render("content_admin/manage_news", {
            layout: "main_admin_login",
        });
    }
    list_news_approved(req, res, next) {
        res.render("content_admin/list_news", {
            layout: "main_admin_login",
        });
    }
    list_news_pending(req, res, next) {
        res.render("content_admin/list_news", {
            layout: "main_admin_login",
        });
    }
    detail_news(req, res, next) {
        res.render("content_admin/detail_news", {
            isDetailNews: true,
            layout: "main_admin_login",
        });
    }
    async list_account_appvoved(req, res, next) {
        var list=await adminModel.getListAccount("approved");
        res.render("content_admin/list_account", {
            layout: "main_admin_login",
            list
        });
    }
    async list_account_pending(req, res, next) {
        var list=await adminModel.getListAccount("pending");
        res.render("content_admin/list_account", {
            layout: "main_admin_login",
            list
        });
    }
    async list_account_locked(req, res, next) {
        var list=await adminModel.getListAccount("locked");
        res.render("content_admin/list_account", {
            layout: "main_admin_login",
            list
        });
    }
    detail_account(req, res, next) {
        res.render("content_admin/detail_account", {
            layout: "main_admin_login",
        });
    }
    // [GET] /forgot_pw

}

module.exports = new Admin();
