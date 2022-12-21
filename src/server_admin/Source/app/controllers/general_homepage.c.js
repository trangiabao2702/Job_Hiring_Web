


class General_Homepage{
    home(req,res) {
        res.render('general/general_homepage.hbs');
    }
}

module.exports=new General_Homepage()