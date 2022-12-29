const adminModel = require("../models/admin.m");

class Admin {
  // [GET] /sign_in
  async homepage(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        var numberAccount = await adminModel.getNumberAccount();
        res.render("content_admin/manage_account", {
          layout: "main_admin_login",
          numberAccount,
        });
      } else {
        res.redirect("/auth/sign_in");
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
        res.redirect("/auth/sign_in");
      }
    } catch (error) {
      next(error);
    }
  }
  async manage_news(req, res, next) {
    var numberNews = await adminModel.getNumberNews();
    res.render("content_admin/manage_news", {
      layout: "main_admin_login",
      numberNews,
    });
  }
  async list_news_approved(req, res, next) {
    var list = await adminModel.getListNew("approved");
    var length = list.length;

    res.render("content_admin/list_news", {
      layout: "main_admin_login",
      list,
      length,
    });
  }
  async list_news_pending(req, res, next) {
    var list = await adminModel.getListNew("pending");
    var length = list.length;

    res.render("content_admin/list_news", {
      layout: "main_admin_login",
      list,
      length,
    });
  }
  async list_news_locked(req, res, next) {
    var list = await adminModel.getListNew("locked");
    var length = list.length;

    res.render("content_admin/list_news", {
      layout: "main_admin_login",
      list,
      length,
    });
  }
  async list_news_removed(req, res, next) {
    var list = await adminModel.getListNew("deleted");
    var length = list.length;
    res.render("content_admin/list_news", {
      layout: "main_admin_login",
      list,
      length,
    });
  }
  async detail_news(req, res, next) {
    var id = req.query.id;
    var news = await adminModel.detail_news(id);
    var isApproved = false,
      isPending = false,
      isLocked = false,
      isDeleted = false;
    if (news.status == "approved") {
      isApproved = true;
    } else if (news.status == "locked") {
      isLocked = true;
    } else if (news.status == "pending") {
      isPending = true;
    } else {
      isDeleted = true;
    }
    var data = { isApproved, isPending, isLocked, isDeleted };
    res.render("content_admin/detail_news", {
      isDetailNews: true,
      layout: "main_admin_login",
      news,
      data,
    });
  }
  async list_account_appvoved(req, res, next) {
    var list = await adminModel.getListAccount("approved");
    res.render("content_admin/list_account", {
      layout: "main_admin_login",
      list,
    });
  }
  async list_account_pending(req, res, next) {
    var list = await adminModel.getListAccount("pending");
    res.render("content_admin/list_account", {
      layout: "main_admin_login",
      list,
    });
  }
  async list_account_locked(req, res, next) {
    var list = await adminModel.getListAccount("locked");
    res.render("content_admin/list_account", {
      layout: "main_admin_login",
      list,
    });
  }
  async detail_account(req, res, next) {
    var id = req.query.id;
    var type = req.query.type;
    var account = await adminModel.getAccountByID(id, type);
    var isApproved = false,
      isPending = false,
      isLocked = false;
    if (account.status == "approved") {
      isApproved = true;
    } else if (account.status == "locked") {
      isLocked = true;
    } else {
      isPending = true;
    }
    var data = { isApproved, isPending, isLocked };
    if (type == "employer") {
      res.render("content_admin/detail_account", {
        layout: "main_admin_login",
        account,
        isEmployer: true,
        data,
      });
    } else {
      res.render("content_admin/detail_account", {
        layout: "main_admin_login",
        account,
        data,
      });
    }
  }
  async approve_account(req, res, next) {
    var id = req.body.id;
    var type = req.body.type;
    await adminModel.status_account(id, "approved", type);
    res.redirect("back");
  }
  async lock_account(req, res, next) {
    var id = req.body.id;
    var type = req.body.type;

    await adminModel.status_account(id, "locked", type);
    res.redirect("back");
  }
  async unlock_account(req, res, next) {
    var id = req.body.id;
    var type = req.body.type;
    await adminModel.status_account(id, "approved", type);
    res.redirect("back");
  }
  async delete_account(req, res, next) {
    var id = req.body.id;
    var type = req.body.type;
    await adminModel.delete_account(id, type);
    res.redirect("/admin/manage_account");
  }
  async status_recruitment(req, res, next) {
    var id = req.body.id;
    var type = req.body.type;
    if (type == "deleted") {
      await adminModel.status_recruitment(id, type);
      return res.redirect("/admin/manage_news");
    } else if (type == "locked") {
      await adminModel.status_recruitment(id, type);
      return res.redirect("back");
    } else if (type == "unlock") {
      type = "approved";
      await adminModel.status_recruitment(id, type);
      return res.redirect("back");
    } else {
      await adminModel.status_recruitment(id, type);
      return res.redirect("back");
    }
  }
  // async list_applied(req, res, next) {
  //     var id=req.query.id;
  //     var list=await adminModel.getListApplied(id);
  //     res.render("content_admin/list_account", {
  //         layout: "main_admin_login",
  //         list
  //     });
  // }
  // [GET] /forgot_pw

  async manage_reports(req, res, next) {
    const _manage_reports = await adminModel.getAllReports();

    res.render("content_admin/manage_reports", {
      layout: "main_admin_login",
      data: {
        manage_reports: JSON.stringify(_manage_reports),
      },
    });
  }

  async list_reports(req, res, next) {
    let _list_reports = "";
    if (req.body.list_pending_reports == "") {
      _list_reports = req.body.list_approved_reports;
    } else {
      _list_reports = req.body.list_pending_reports;
    }

    _list_reports = JSON.parse(_list_reports);
    for (let i = 0; i < _list_reports.length; i++) {
      // get name of reporter
      const _info_reporter = await adminModel.getAccountByID(_list_reports[i].id_reporter, "candidate");
      _list_reports[i].reporter_name = _info_reporter.name;

      // get title of reported recruitment
      const _info_reported = await adminModel.detail_news(_list_reports[i].id_reported);
      _list_reports[i].reported_title = _info_reported.title;
    }

    res.render("content_admin/list_reports", {
      layout: "main_admin_login",
      data: {
        list_reports: JSON.stringify(_list_reports),
      },
    });
  }
}

module.exports = new Admin();
