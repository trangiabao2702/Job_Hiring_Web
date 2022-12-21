


class Candidate{
    login(req,res) {
        res.render('candidate/content_login.hbs');
    }
    signup(req,res){
        res.render('candidate/content_signup.hbs');
    }
    forget_password(req,res){
        res.render('candidate/content_forget_password.hbs');

    }
    authentication(req,res){
        res.render('candidate/content_authentication.hbs');

    }
    reset_password(req,res){
        res.render('candidate/content_reset_password.hbs');

    }
    home(req,res){
        res.render('candidate/content_home.hbs',{
            layout: 'main_candidate_login'
        });

    }
    detail_job(req,res){
        res.render('candidate/content_detail_job.hbs',{
            layout: 'main_candidate_login'
        });

    }
    manage_record(req,res){
        res.render('candidate/content_manage_record.hbs',{
            layout: 'main_candidate_login'
        });

    }
    
}

module.exports=new Candidate()