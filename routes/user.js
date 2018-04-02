
//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;
      var fname= post.first_name;
      var lname= post.last_name;
      var mob= post.mob_no;

      var sql = "INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`, `password`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass + "')";

      var query = db.query(sql, function(err, result) {

         message = "Succesfully! Your account has been created.";
         res.render('signup.ejs',{message: message});
      });

   } else {
      res.render('signup');
   }
};
 
//-----------------------------------------------login page call------------------------------------------------------
exports.login = function(req, res){
   var message = '';
   var sess = req.session; 

   if(req.method == "POST"){
      var post  = req.body;
      
      var name= post.user_name;
      var pass= post.password;
     
      var sql="SELECT id, first_name, last_name, user_name,profession FROM `users` WHERE `user_name`='"+name+"' and password = '"+pass+"'";                           
      db.query(sql, function(err, results){      
         if(results.length){
           
            req.session.userId = results[0].id;
            req.session.prof = results[0].profession;
            req.session.username = results[0].user_name;
            console.log("prof"+req.session.prof);
             
            res.redirect('/room');
         }
         else{
            message = 'Wrong Credentials.';
            res.render('index.ejs',{message: message});
         }
                 
      });
   } else {
      res.render('index.ejs',{message: message});
   }
           
};
//-----------------------------------------------dashboard page functionality----------------------------------------------
           
exports.dashboard = function(req, res, next){
           
   var user =  req.session.user,
   userId = req.session.userId;
   console.log('ddd='+userId);
   if(userId == null){
      res.redirect("/user/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";

   db.query(sql, function(err, results){
      res.render('dashboard.ejs', {user:user});    
   });       
};
//------------------------------------logout functionality----------------------------------------------
exports.logout=function(req,res){
   console.logout("inside logout");
 var userId = req.session.userId;
 var userprof=req.session.prof;
// if(userprof=="professor")
//     {
//        var delsql = "DELETE from `roomactive` where activeroom='"+req.session.rname+"'";
//
//      var query = db.query(delsql, function(err, result) {
//
//        console.log("deleted from logout");
//      }); 
//     }
//     else{
//         
//     }
   req.session.destroy(function(err) {
    
      res.redirect("/user/login");
   })
};



            
        
//--------------------------------render user details after login--------------------------------
exports.profile = function(req, res){

   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/user/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";          
   db.query(sql, function(err, result){  
      res.render('profile.ejs',{data:result});
   });
};
//---------------------------------edit users details after login----------------------------------
exports.editprofile=function(req,res){
   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/user/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
   db.query(sql, function(err, results){
      res.render('edit_profile.ejs',{data:results});
   });
};


exports.getname=function(req,res){
    var id = req.params.id;

   var sql="SELECT * FROM `users` WHERE `id`='"+id+"'";
   db.query(sql, function(err, results){
       //console.log(results[0].id);
    res.send( results[0]);
   });
};

//exports.getprofession=function(req,res){
//    var id = req.params.id;
//
//   var sql="SELECT * FROM `users` WHERE `id`='"+id+"'";
//   db.query(sql, function(err, results){
//       //console.log(results[0].id);
//    res.send( results[0]);
//   });
//};

