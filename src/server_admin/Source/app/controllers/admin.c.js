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
    async detail_account(req, res, next) {
        var id=req.query.id;
        var type=req.query.type;
        var account=await adminModel.getAccountByID(id,type);
        var isApproved=false,isPending=false,isLocked=false;
        if(account.status=="approved")
        {
            isApproved=true;
        }
        else if(account.status=="locked"){
            isLocked=true;
        }
        else{
            isPending=true;
        }
        var data={isApproved,isPending,isLocked}
        if(type=="employer")
        {
            res.render("content_admin/detail_account", {
                layout: "main_admin_login",
                account,
                isEmployer:true,
                data
            });
        }
        else{
            res.render("content_admin/detail_account", {
                layout: "main_admin_login",
                account,
                data
            });
        }
   
    }
    async approve_account(req,res,next){
        var id=req.body.id;
        var type=req.body.type;
        await adminModel.status_account(id,"approved",type);
        res.redirect('back');
    }
    async lock_account(req,res,next){
        var id=req.body.id;
        var type=req.body.type;

        await adminModel.status_account(id,"locked",type);
        res.redirect('back');
    }
    async unlock_account(req,res,next){
        var id=req.body.id;
        var type=req.body.type;
        await adminModel.status_account(id,"approved",type);
        res.redirect('back');
    }
    async delete_account(req,res,next){
        var id=req.body.id;
        var type=req.body.type;
        await adminModel.delete_account(id,type);
        res.redirect('/admin/manage_account');
    }

    // [GET] /forgot_pw

}

module.exports = new Admin();
