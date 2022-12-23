
class SiteController {
    // [GET] /homepage
    index(req, res, next) {
        res.redirect('/auth/sign_in');
    }


}

module.exports = new SiteController();
