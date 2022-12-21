
class SiteController {

    //GET/
    async index(req, res, next) {
       
        res.send('hello')
    }

    // GET/all
    notFoundPage(req, res, next) {
        try {

            res.status(404).send('<h1>Error: 404! Page not found</h1>');

        }
        catch (error) {
            next(error);
        }

    }


}

module.exports = new SiteController();