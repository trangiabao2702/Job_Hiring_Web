const employerModel = require("../models/employer.m");

const bcrypt = require('bcrypt');
const saltRounds = 10;


class AuthController {
  // [GET] /sign_up
  sign_up(req, res, next) {
    res.render("contents/sign_up", {
      layout: "main_employer_not_login",
    });
  }

  // [GET] /sign_in
  sign_in(req, res, next) {
    res.render("contents/sign_in", {
      layout: "main_employer_not_login",
    });
  }

  // [GET] /forgot_pw
  forgot_pw(req, res, next) {
    res.render("contents/forgot_pw", {
      layout: "main_employer_not_login",
    });
  }

  // [GET] /account_authentication
  account_authentication(req, res, next) {
    res.render("contents/account_authentication", {
      layout: "main_employer_not_login",
    });
  }

  // [GET] /reset_pw
  reset_pw(req, res, next) {
    res.render("contents/reset_pw", {
      layout: "main_employer_not_login",
    });
  }


  //[POST] /sign_up
   async postSignUp(req, res, next) {
    try {
        
        const name = req.body.name_company_signin_recuit;
        const email = req.body.email_signin_recuit;
        const password = req.body.password_signin_recruit;
        const phone = req.body.phone_signin_recuit;
        const province = req.body.select_province_signin_recruit;
        const district = req.body.select_district_signin_recruit;

        const salt = bcrypt.genSaltSync(saltRounds);
        const pwHashed = bcrypt.hashSync(password, salt);

        const user = {
            name: name,
            email: email,
            password: pwHashed,
            avatar: null,
            phone: phone,
            province: province,
            district: district,
            status: "0"
        }

        const userNew = await employerModel.addEmployer(user);

        if (userNew) {
            req.flash('message', 'Đăng ký thành công')
            res.redirect('/auth/sign_in');
        } else {

            req.flash('messageDanger', 'Tài khoản đã tồn tại')
            res.redirect('/auth/sign_up');
        }


    } catch (error) {
        next(error);
    }
  }

}

module.exports = new AuthController();
