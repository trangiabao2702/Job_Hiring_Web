const employerModel = require("../models/employer.m");
const mailer = require('../../utils/mailer');
const bcrypt = require("bcrypt");
const saltRounds = 10;

class AuthController {
  // [GET] /sign_up
  sign_up(req, res, next) {
    res.render("contents/sign_up", {
      layout: "main_employer_not_login",
      message: req.flash("message"),
      messageDanger: req.flash("messageDanger"),
    });
  }

  // [GET] /sign_in
  sign_in(req, res, next) {
    res.render("contents/sign_in", {
      layout: "main_employer_not_login",
      message: req.flash("message"),
      messageDanger: req.flash("messageDanger"),
    });
  }

  // [GET] /forgot_pw
  forgot_pw(req, res, next) {
    res.render("contents/forgot_pw", {
      layout: "main_employer_not_login",
      message: req.flash("message"),
      messageDanger: req.flash("messageDanger"),
    });
  }

  // [GET] /account_authentication
  account_authentication(req, res, next) {
    res.render("contents/account_authentication", {
      layout: "main_employer_not_login",
    });
  }

  // [GET] /reset_password:email
  reset_password(req, res, next) {
    try {
      console.log(1);
      if (!req.params.email || !req.query.token) {
        res.redirect('/auth/forget_password');
      } else {
        res.render('contents/reset_pw.hbs', {       
          layout: "main_employer_not_login",
          email: req.params.email, 
          token: req.query.token });
      }
    } catch (error) {
      next(error);
    }

  }

  // [GET] verify
  verify(req, res, next) {
    bcrypt.compare(req.query.email, req.query.token, (err, result) => {
      if (result === true) {
        employerModel.verify(req.query.email, (err, result) => {
          if (!err) {
            res.render('contents/verify.hbs', { layout: false });
          } else {
            res.redirect('/500');
          }
        });
      } else {
        res.redirect('/404');
      }
    })
  }


  // [GET] /authentication
  authentication(req, res, next) {
    res.render('contents/content_authentication.hbs',{
      layout: "main_employer_not_login",
    });

  }

  //[POST] /reset_password
  async post_reset_password(req, res, next) {
    try {

      const { email, token, new_password } = req.body;
      console.log(email, token, new_password);

      if (!email || !token || !new_password) {
        res.redirect('/auth/reset_password');
      } else {
        bcrypt.compare(email, token, (err, result) => {

          if (result === true) {
            bcrypt.hash(new_password, saltRounds).then(hashedPassword => {
              employerModel.resetPassword(email, hashedPassword, (err, result) => {
                if (!err) {
                  req.flash("message", "Đổi mật khẩu thành công!");
                  res.redirect('/auth/sign_in');
                } else {
                  res.redirect('/500');
                }

              });
            })
          } else {
            res.redirect('/auth/reset_password');
          }
        })
      }



    } catch (error) {
      next(error);
    }
  }

  //[POST] /sign_up
  async postSignUp(req, res, next) {
    try {
      const name = req.body.name_company_signin_recuit;
      const email = req.body.email_signin_recuit;
      const password = req.body.password_signin_recruit;
      const phone = req.body.phone_signin_recuit;
      const province_code = req.body.select_province_signin_recruit.split("|||");
      const district = req.body.select_district_signin_recruit;
      const ward = req.body.select_ward_signin_recruit;
      const street = req.body.street;

      const salt = bcrypt.genSaltSync(saltRounds);
      const pwHashed = bcrypt.hashSync(password, salt);

      const defaultAvt = await employerModel.getAvatarFromStorage("avatarDefault.png");

      const _current_date = require("firebase-admin").firestore.Timestamp.fromDate(new Date());

      const user = {
        name: name,
        email: email,
        password: pwHashed,
        avatar: defaultAvt,
        phone: phone,
        province: province_code[1],
        district: district,
        ward: ward,
        street: street,
        status: "pending",
        list_recruitments: [],
        list_reviews: [],
        office: "",
        rating: 0,
        creation_date: _current_date,
        code_province: province_code[0],
        verify: false
      };

      const userNew = await employerModel.addEmployer(user);

      if (userNew) {

        // send mail xác thực 
        bcrypt.hash(user.email, parseInt(saltRounds)).then((hashEmail) => {
          // console.log(`${process.env.APP_URL}/auth/verify?email=${user.email}&token=${hashEmail}`);
          mailer.sendMail(user.email, `Email xác thực thông tin tài khoản nhà tuyển dụng ${user.name}`,
            `
                                  <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
              <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
              <head>
              <!--[if gte mso 9]>
              <xml>
              <o:OfficeDocumentSettings>
                  <o:AllowPNG/>
                  <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
              </xml>
              <![endif]-->
              <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta name="x-apple-disable-message-reformatting">
              <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
              <title></title>
              
                  <style type="text/css">
                  @media only screen and (min-width: 620px) {
              .u-row {
                  width: 600px !important;
              }
              .u-row .u-col {
                  vertical-align: top;
              }

              .u-row .u-col-100 {
                  width: 600px !important;
              }

              }

              @media (max-width: 620px) {
              .u-row-container {
                  max-width: 100% !important;
                  padding-left: 0px !important;
                  padding-right: 0px !important;
              }
              .u-row .u-col {
                  min-width: 320px !important;
                  max-width: 100% !important;
                  display: block !important;
              }
              .u-row {
                  width: 100% !important;
              }
              .u-col {
                  width: 100% !important;
              }
              .u-col > div {
                  margin: 0 auto;
              }
              }
              body {
              margin: 0;
              padding: 0;
              }

              table,
              tr,
              td {
              vertical-align: top;
              border-collapse: collapse;
              }

              p {
              margin: 0;
              }

              .ie-container table,
              .mso-container table {
              table-layout: fixed;
              }

              * {
              line-height: inherit;
              }

              a[x-apple-data-detectors='true'] {
              color: inherit !important;
              text-decoration: none !important;
              }

              table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_image_4 .v-src-width { width: auto !important; } #u_content_image_4 .v-src-max-width { max-width: 43% !important; } #u_content_heading_1 .v-container-padding-padding { padding: 8px 20px 0px !important; } #u_content_heading_1 .v-font-size { font-size: 21px !important; } #u_content_heading_1 .v-text-align { text-align: center !important; } #u_content_text_2 .v-container-padding-padding { padding: 35px 15px 10px !important; } #u_content_text_3 .v-container-padding-padding { padding: 10px 15px 40px !important; } }
                  </style>
              
              

              <!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->

              </head>

              <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #c2e0f4;color: #000000">
              <!--[if IE]><div class="ie-container"><![endif]-->
              <!--[if mso]><div class="mso-container"><![endif]-->
              <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #c2e0f4;width:100%" cellpadding="0" cellspacing="0">
              <tbody>
              <tr style="vertical-align: top">
                  <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #c2e0f4;"><![endif]-->
                  

              <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
                  
              <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
              <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
              <div style="height: 100%;width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
              
              <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
              <tbody>
                  <tr>
                  <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px 0px 10px;font-family:arial,helvetica,sans-serif;" align="left">
                      
              <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 6px solid #6f9de1;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                  <tbody>
                  <tr style="vertical-align: top">
                      <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                      <span>&#160;</span>
                      </td>
                  </tr>
                  </tbody>
              </table>

                  </td>
                  </tr>
              </tbody>
              </table>

              <table id="u_content_image_4" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
              <tbody>
                  <tr>
                  <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:20px 10px;font-family:arial,helvetica,sans-serif;" align="left">
                      
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                  <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">
                  
                  <img align="center" border="0" src="https://firebasestorage.googleapis.com/v0/b/jobhiringweb.appspot.com/o/logo%2FlogoBusiness.png?alt=media&token=00de7530-d9d1-4d9a-bf61-4be4858b389d" alt="Logo" title="Logo" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 30%;max-width: 174px;" width="174" class="v-src-width v-src-max-width"/>
                  
                  </td>
              </tr>
              </table>

                  </td>
                  </tr>
              </tbody>
              </table>

              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
              </div>
              <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                  </div>
              </div>
              </div>



              <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
                  
              <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
              <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
              <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
              <!--[if (!mso)&(!IE)]><!--><div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
              
              <table id="u_content_heading_1" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
              <tbody>
                  <tr>
                  <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:9px 30px 40px 31px;font-family:arial,helvetica,sans-serif;" align="left">
                      
              <h1 class="v-text-align v-font-size" style="margin: 0px; color: #023047; line-height: 170%; text-align: center; word-wrap: break-word; font-weight: normal; font-family: 'Open Sans',sans-serif; font-size: 26px;"><strong>Xác thực tài khoản nhà tuyển dụng</strong></h1>

                  </td>
                  </tr>
              </tbody>
              </table>

              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
              </div>
              <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                  </div>
              </div>
              </div>



              <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
                  
              <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
              <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
              <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
              <!--[if (!mso)&(!IE)]><!--><div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
              
              <table id="u_content_text_2" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
              <tbody>
                  <tr>
                  <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:35px 55px 10px;font-family:arial,helvetica,sans-serif;" align="left">
                      
              <div class="v-text-align" style="color: #333333; line-height: 180%; text-align: left; word-wrap: break-word;">
                  <p style="font-size: 14px; line-height: 180%;"><em><span style="font-size: 18px; line-height: 32.4px; font-family: Lato, sans-serif;"><strong><span style="line-height: 32.4px; font-size: 18px;">Xin chào ${user.name}, </span></strong></span></em></p>
              <p style="font-size: 14px; line-height: 180%;"> </p>
              <p style="font-size: 14px; line-height: 180%; text-align: justify;"><span style="font-family: Lato, sans-serif; font-size: 16px; line-height: 28.8px;">Cảm ơn bạn đã đã đăng ký tài khoản trên <span style="color: #3598db; font-size: 16px; line-height: 28.8px;"><strong>JORE Business</strong></span>, để có trải nghiệm dịch vụ và được hỗ trợ tốt nhất, bạn cần hoàn thiện xác thực tài khoản. 
              Sau đó, chúng tôi sẽ xem xét tài khoản của bạn và sớm liên lạc với bạn</span></p>
              <p style="font-size: 14px; line-height: 180%;"> </p>
              </div>

                  </td>
                  </tr>
              </tbody>
              </table>

              <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
              <tbody>
                  <tr>
                  <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:20px 10px 30px;font-family:arial,helvetica,sans-serif;" align="left">
                      
              <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
              <div class="v-text-align" align="center">
              <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://unlayer.com" style="height:59px; v-text-anchor:middle; width:253px;" arcsize="74.5%"  stroke="f" fillcolor="#3598db"><w:anchorlock/><center style="color:#FFFFFF;font-family:arial,helvetica,sans-serif;"><![endif]-->  
                  <a href="${process.env.APP_URL}/auth/verify?email=${user.email}&token=${hashEmail}" target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #3598db; border-radius: 44px;-webkit-border-radius: 44px; -moz-border-radius: 44px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;">
                  <span style="display:block;padding:20px 70px;line-height:120%;"><span style="font-size: 16px; line-height: 19.2px;"><strong><span style="font-family: 'Open Sans', sans-serif; line-height: 19.2px; font-size: 16px;">Xác thực ngay</span></strong></span></span>
                  </a>
              <!--[if mso]></center></v:roundrect><![endif]-->
              </div>

                  </td>
                  </tr>
              </tbody>
              </table>

              <table id="u_content_text_3" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
              <tbody>
                  <tr>
                  <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 55px 40px;font-family:arial,helvetica,sans-serif;" align="left">
                      
              <div class="v-text-align" style="line-height: 170%; text-align: left; word-wrap: break-word;">
                  <p style="font-size: 14px; line-height: 170%;"><span style="font-family: Lato, sans-serif; font-size: 16px; line-height: 27.2px;">Trân trọng,</span></p>
              <p style="font-size: 14px; line-height: 170%;"><em><span style="font-family: Lato, sans-serif; font-size: 14px; line-height: 23.8px; color: #3598db;"><strong><span style="font-size: 16px; line-height: 27.2px;">JORE</span></strong></span></em></p>
              </div>

                  </td>
                  </tr>
              </tbody>
              </table>

              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
              </div>
              <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                  </div>
              </div>
              </div>



              <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
                  
              <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
              <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
              <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
              <!--[if (!mso)&(!IE)]><!--><div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
              
              <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
              <tbody>
                  <tr>
                  <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:5px 10px 40px;font-family:arial,helvetica,sans-serif;" align="left">
                      
              <h2 class="v-text-align v-font-size" style="margin: 0px; color: #000000; line-height: 140%; text-align: center; word-wrap: break-word; font-weight: normal; font-family: 'Lato',sans-serif; font-size: 20px;"><strong>Liên hệ với chúng tôi:</strong> jobhiringweb@gmail.com</h2>

                  </td>
                  </tr>
              </tbody>
              </table>

              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
              </div>
              <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                  </div>
              </div>
              </div>



              <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #080f30;">
                  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #080f30;"><![endif]-->
                  
              <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
              <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
              <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
              <!--[if (!mso)&(!IE)]><!--><div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->


              <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
              <tbody>
                  <tr>
                  <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 35px;font-family:arial,helvetica,sans-serif;" align="left">
                      
              <div class="v-text-align" style="color: #ffffff; line-height: 210%; text-align: center; word-wrap: break-word;">
                  <p style="font-size: 14px; line-height: 210%;"><span style="font-family: Lato, sans-serif; font-size: 14px; line-height: 29.4px;">You're receiving this email because you asked us about regular newsletter.</span></p>
              <p style="font-size: 14px; line-height: 210%;"><span style="font-family: Lato, sans-serif; font-size: 14px; line-height: 29.4px;">©2022 JORE | VNU-HCMUS</span></p>
              </div>

                  </td>
                  </tr>
              </tbody>
              </table>

              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
              </div>
              <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                  </div>
              </div>
              </div>


                  <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                  </td>
              </tr>
              </tbody>
              </table>
              <!--[if mso]></div><![endif]-->
              <!--[if IE]></div><![endif]-->
              </body>

              </html>

          `)
        })

        req.flash("message", "Đăng ký thành công");
        res.redirect("/auth/sign_in");
      } else {
        req.flash("messageDanger", "Tài khoản đã tồn tại");
        res.redirect("/auth/sign_up");
      }
    } catch (error) {
      next(error);
    }
  }

  // [POST] /sign_in
  postSignIn(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }

  // [POST] /logout
  postLogout(req, res, next) {
    try {
      if (req.isAuthenticated()) {
        req.logout((err) => {
          if (err) {
            return next(err);
          }
        });
      }
      res.redirect("/auth/sign_in");
    } catch (error) {
      next(error);
    }
  }

  // [POST] /porget_password
  async post_forget_password(req, res, next) {
    try {
      const emailReset = req.body.email;
      console.log(emailReset);
      const user = await employerModel.getEmployerByEmail(emailReset);


      if (!user) {
        // không tồn tại user trên db
        req.flash('messageDanger', 'Tài khoản không tồn tại trên JORE!');
        res.redirect('/auth/forgot_pw');
      } else if (!user.verify) {
        req.flash('messageDanger', 'Bạn chưa xác thực tài khoản, hãy xác thực tài khoản trong mail để tiếp tục sử dụng!');
        res.redirect('/auth/forgot_pw');
      } else if (user.status !== 'approved') {
        req.flash('messageDanger', 'Tài khoản chưa được JORE xác thực!');
        res.redirect('/auth/forgot_pw');
      } else {
        bcrypt.hash(user.email, parseInt(saltRounds)).then((hashEmail) => {
          console.log(`${process.env.APP_URL}/auth/reset_password/${user.email}?token=${hashEmail}`);
          mailer.sendMail(user.email, `Reset mật khẩu`,
            `
                                                <!DOCTYPE HTML
                            PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
                            xmlns:o="urn:schemas-microsoft-com:office:office">

                        <head>
                            <!--[if gte mso 9]>
                        <xml>
                        <o:OfficeDocumentSettings>
                            <o:AllowPNG/>
                            <o:PixelsPerInch>96</o:PixelsPerInch>
                        </o:OfficeDocumentSettings>
                        </xml>
                        <![endif]-->
                            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <meta name="x-apple-disable-message-reformatting">
                            <!--[if !mso]><!-->
                            <meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
                            <title></title>

                            <style type="text/css">
                                @media only screen and (min-width: 620px) {
                                    .u-row {
                                        width: 600px !important;
                                    }

                                    .u-row .u-col {
                                        vertical-align: top;
                                    }

                                    .u-row .u-col-100 {
                                        width: 600px !important;
                                    }

                                }

                                @media (max-width: 620px) {
                                    .u-row-container {
                                        max-width: 100% !important;
                                        padding-left: 0px !important;
                                        padding-right: 0px !important;
                                    }

                                    .u-row .u-col {
                                        min-width: 320px !important;
                                        max-width: 100% !important;
                                        display: block !important;
                                    }

                                    .u-row {
                                        width: 100% !important;
                                    }

                                    .u-col {
                                        width: 100% !important;
                                    }

                                    .u-col>div {
                                        margin: 0 auto;
                                    }
                                }

                                body {
                                    margin: 0;
                                    padding: 0;
                                }

                                table,
                                tr,
                                td {
                                    vertical-align: top;
                                    border-collapse: collapse;
                                }

                                p {
                                    margin: 0;
                                }

                                .ie-container table,
                                .mso-container table {
                                    table-layout: fixed;
                                }

                                * {
                                    line-height: inherit;
                                }

                                a[x-apple-data-detectors='true'] {
                                    color: inherit !important;
                                    text-decoration: none !important;
                                }

                                table,
                                td {
                                    color: #000000;
                                }

                                #u_body a {
                                    color: #0000ee;
                                    text-decoration: underline;
                                }

                                @media (max-width: 480px) {
                                    #u_content_image_4 .v-src-width {
                                        width: auto !important;
                                    }

                                    #u_content_image_4 .v-src-max-width {
                                        max-width: 43% !important;
                                    }

                                    #u_content_heading_1 .v-container-padding-padding {
                                        padding: 8px 20px 0px !important;
                                    }

                                    #u_content_heading_1 .v-font-size {
                                        font-size: 21px !important;
                                    }

                                    #u_content_heading_1 .v-text-align {
                                        text-align: center !important;
                                    }

                                    #u_content_text_2 .v-container-padding-padding {
                                        padding: 35px 15px 10px !important;
                                    }

                                    #u_content_text_3 .v-container-padding-padding {
                                        padding: 10px 15px 40px !important;
                                    }
                                }
                            </style>



                            <!--[if !mso]><!-->
                            <link href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap" rel="stylesheet" type="text/css">
                            <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet"
                                type="text/css">
                            <!--<![endif]-->

                        </head>

                        <body class="clean-body u_body"
                            style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #c2e0f4;color: #000000">
                            <!--[if IE]><div class="ie-container"><![endif]-->
                            <!--[if mso]><div class="mso-container"><![endif]-->
                            <table id="u_body"
                                style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #c2e0f4;width:100%"
                                cellpadding="0" cellspacing="0">
                                <tbody>
                                    <tr style="vertical-align: top">
                                        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #c2e0f4;"><![endif]-->


                                            <div class="u-row-container" style="padding: 0px;background-color: transparent">
                                                <div class="u-row"
                                                    style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                                                    <div
                                                        style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->

                                                        <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                                                        <div class="u-col u-col-100"
                                                            style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                                            <div style="height: 100%;width: 100% !important;">
                                                                <!--[if (!mso)&(!IE)]><!-->
                                                                <div
                                                                    style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                                                    <!--<![endif]-->

                                                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                                        cellpadding="0" cellspacing="0" width="100%" border="0">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td class="v-container-padding-padding"
                                                                                    style="overflow-wrap:break-word;word-break:break-word;padding:0px 0px 10px;font-family:arial,helvetica,sans-serif;"
                                                                                    align="left">

                                                                                    <table height="0px" align="center" border="0"
                                                                                        cellpadding="0" cellspacing="0" width="100%"
                                                                                        style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 6px solid #6f9de1;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                                                                        <tbody>
                                                                                            <tr style="vertical-align: top">
                                                                                                <td
                                                                                                    style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                                                                                    <span>&#160;</span>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>

                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>

                                                                    <table id="u_content_image_4"
                                                                        style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                                        cellpadding="0" cellspacing="0" width="100%" border="0">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td class="v-container-padding-padding"
                                                                                    style="overflow-wrap:break-word;word-break:break-word;padding:20px 10px;font-family:arial,helvetica,sans-serif;"
                                                                                    align="left">

                                                                                    <table width="100%" cellpadding="0" cellspacing="0"
                                                                                        border="0">
                                                                                        <tr>
                                                                                            <td class="v-text-align"
                                                                                                style="padding-right: 0px;padding-left: 0px;"
                                                                                                align="center">

                                                                                                <img align="center" border="0"
                                                                                                    src="https://firebasestorage.googleapis.com/v0/b/jobhiringweb.appspot.com/o/logo%2FlogoBusiness.png?alt=media&token=00de7530-d9d1-4d9a-bf61-4be4858b389d"
                                                                                                    alt="Logo" title="Logo"
                                                                                                    style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 30%;max-width: 174px;"
                                                                                                    width="174"
                                                                                                    class="v-src-width v-src-max-width" />

                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>

                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>

                                                                    <!--[if (!mso)&(!IE)]><!-->
                                                                </div><!--<![endif]-->
                                                            </div>
                                                        </div>
                                                        <!--[if (mso)|(IE)]></td><![endif]-->
                                                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                                    </div>
                                                </div>
                                            </div>



                                            <div class="u-row-container" style="padding: 0px;background-color: transparent">
                                                <div class="u-row"
                                                    style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                                                    <div
                                                        style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->

                                                        <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                                        <div class="u-col u-col-100"
                                                            style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                                            <div
                                                                style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                                <!--[if (!mso)&(!IE)]><!-->
                                                                <div
                                                                    style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                                    <!--<![endif]-->

                                                                    <!--[if (!mso)&(!IE)]><!-->
                                                                </div><!--<![endif]-->
                                                            </div>
                                                        </div>
                                                        <!--[if (mso)|(IE)]></td><![endif]-->
                                                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                                    </div>
                                                </div>
                                            </div>



                                            <div class="u-row-container" style="padding: 0px;background-color: transparent">
                                                <div class="u-row"
                                                    style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                                                    <div
                                                        style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->

                                                        <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                                        <div class="u-col u-col-100"
                                                            style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                                            <div
                                                                style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                                <!--[if (!mso)&(!IE)]><!-->
                                                                <div
                                                                    style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                                    <!--<![endif]-->

                                                                    <table id="u_content_text_2" style="font-family:arial,helvetica,sans-serif;"
                                                                        role="presentation" cellpadding="0" cellspacing="0" width="100%"
                                                                        border="0">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td class="v-container-padding-padding"
                                                                                    style="overflow-wrap:break-word;word-break:break-word;padding:35px 55px 10px;font-family:arial,helvetica,sans-serif;"
                                                                                    align="left">

                                                                                    <div class="v-text-align"
                                                                                        style="color: #333333; line-height: 180%; text-align: left; word-wrap: break-word;">
                                                                                        <p style="font-size: 14px; line-height: 180%;"><em><span
                                                                                                    style="font-size: 18px; line-height: 32.4px; font-family: Lato, sans-serif;"><strong><span
                                                                                                            style="line-height: 32.4px; font-size: 18px;">Bạn
                                                                                                            vừa gửi yêu cầu reset mật
                                                                                                            khẩu?</span></strong></span></em>
                                                                                        </p>
                                                                                        <p style="font-size: 14px; line-height: 180%;"> </p>
                                                                                        <p
                                                                                            style="font-size: 14px; line-height: 180%; text-align: justify;">
                                                                                            <span
                                                                                                style="font-family: Lato, sans-serif; font-size: 16px; line-height: 28.8px;">Click
                                                                                                vào link sau để reset lại mật khẩu: <a
                                                                                                    style="color: #3598db; font-size: 16px; line-height: 28.8px;"
                                                                                                    href="${process.env.APP_URL}/auth/reset_password/${user.email}?token=${hashEmail}">${process.env.APP_URL}/auth/reset_password/${user.email}&token=${hashEmail}</a>
                                                                                            </span>
                                                                                            <br>
                                                                                            <span
                                                                                                style="font-family: Lato, sans-serif; font-size: 16px; line-height: 28.8px;">Nếu
                                                                                                không phải bạn đã gửi yêu cầu reset mật khẩu,
                                                                                                xin hãy bỏ qua email này.

                                                                                            </span>

                                                                                            <br>
                                                                                            <span
                                                                                                style="font-family: Lato, sans-serif; font-size: 16px; line-height: 28.8px;">
                                                                                                Nếu có bất kì thắc mắc nào, vui lòng liên hệ
                                                                                                <span
                                                                                                    style="color: #3598db; font-size: 16px; line-height: 28.8px;">jobhiringweb@gmai.com</span>
                                                                                                để nhận được hỗ trợ.
                                                                                            </span>
                                                                                            <br>
                                                                                            <span
                                                                                                style="font-family: Lato, sans-serif; font-size: 16px; line-height: 28.8px;">
                                                                                                Cảm ơn bạn đã sử dụng dịch vụ.
                                                                                            </span>
                                                                                        </p>
                                                                                        <p style="font-size: 14px; line-height: 180%;"> </p>
                                                                                    </div>

                                                                                </td>
                                                                            </tr>


                                                                        </tbody>
                                                                    </table>

                                                                    <table id="u_content_text_3" style="font-family:arial,helvetica,sans-serif;"
                                                                        role="presentation" cellpadding="0" cellspacing="0" width="100%"
                                                                        border="0">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td class="v-container-padding-padding"
                                                                                    style="overflow-wrap:break-word;word-break:break-word;padding:10px 55px 40px;font-family:arial,helvetica,sans-serif;"
                                                                                    align="left">

                                                                                    <div class="v-text-align"
                                                                                        style="line-height: 170%; text-align: left; word-wrap: break-word;">
                                                                                        <p style="font-size: 14px; line-height: 170%;"><span
                                                                                                style="font-family: Lato, sans-serif; font-size: 16px; line-height: 27.2px;">Trân
                                                                                                trọng,</span></p>
                                                                                        <p style="font-size: 14px; line-height: 170%;"><em><span
                                                                                                    style="font-family: Lato, sans-serif; font-size: 14px; line-height: 23.8px; color: #3598db;"><strong><span
                                                                                                            style="font-size: 16px; line-height: 27.2px;">JORE</span></strong></span></em>
                                                                                        </p>
                                                                                    </div>

                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>

                                                                    <!--[if (!mso)&(!IE)]><!-->
                                                                </div><!--<![endif]-->
                                                            </div>
                                                        </div>
                                                        <!--[if (mso)|(IE)]></td><![endif]-->
                                                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                                    </div>
                                                </div>
                                            </div>



                                            <div class="u-row-container" style="padding: 0px;background-color: transparent">
                                                <div class="u-row"
                                                    style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                                                    <div
                                                        style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->

                                                        <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                                        <div class="u-col u-col-100"
                                                            style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                                            <div
                                                                style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                                <!--[if (!mso)&(!IE)]><!-->
                                                                <div
                                                                    style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                                    <!--<![endif]-->

                                                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                                        cellpadding="0" cellspacing="0" width="100%" border="0">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td class="v-container-padding-padding"
                                                                                    style="overflow-wrap:break-word;word-break:break-word;padding:5px 10px 40px;font-family:arial,helvetica,sans-serif;"
                                                                                    align="left">

                                                                                    <h2 class="v-text-align v-font-size"
                                                                                        style="margin: 0px; color: #000000; line-height: 140%; text-align: center; word-wrap: break-word; font-weight: normal; font-family: 'Lato',sans-serif; font-size: 20px;">
                                                                                        <strong>Liên hệ với chúng tôi:</strong>
                                                                                        jobhiringweb@gmail.com
                                                                                    </h2>

                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>

                                                                    <!--[if (!mso)&(!IE)]><!-->
                                                                </div><!--<![endif]-->
                                                            </div>
                                                        </div>
                                                        <!--[if (mso)|(IE)]></td><![endif]-->
                                                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                                    </div>
                                                </div>
                                            </div>



                                            <div class="u-row-container" style="padding: 0px;background-color: transparent">
                                                <div class="u-row"
                                                    style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #080f30;">
                                                    <div
                                                        style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #080f30;"><![endif]-->

                                                        <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                                        <div class="u-col u-col-100"
                                                            style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                                            <div
                                                                style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                                <!--[if (!mso)&(!IE)]><!-->
                                                                <div
                                                                    style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                                    <!--<![endif]-->


                                                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                                        cellpadding="0" cellspacing="0" width="100%" border="0">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td class="v-container-padding-padding"
                                                                                    style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 35px;font-family:arial,helvetica,sans-serif;"
                                                                                    align="left">

                                                                                    <div class="v-text-align"
                                                                                        style="color: #ffffff; line-height: 210%; text-align: center; word-wrap: break-word;">
                                                                                        <p style="font-size: 14px; line-height: 210%;"><span
                                                                                                style="font-family: Lato, sans-serif; font-size: 14px; line-height: 29.4px;">You're
                                                                                                receiving this email because you asked us about
                                                                                                regular newsletter.</span></p>
                                                                                        <p style="font-size: 14px; line-height: 210%;"><span
                                                                                                style="font-family: Lato, sans-serif; font-size: 14px; line-height: 29.4px;">©2022
                                                                                                JORE | VNU-HCMUS</span></p>
                                                                                    </div>

                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>

                                                                    <!--[if (!mso)&(!IE)]><!-->
                                                                </div><!--<![endif]-->
                                                            </div>
                                                        </div>
                                                        <!--[if (mso)|(IE)]></td><![endif]-->
                                                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                                    </div>
                                                </div>
                                            </div>


                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <!--[if mso]></div><![endif]-->
                            <!--[if IE]></div><![endif]-->
                        </body>

                        </html>

                `)
        });
        res.redirect('/auth/authentication');
      }

    } catch (error) {
      next(error);
    }
  }

}

module.exports = new AuthController();
