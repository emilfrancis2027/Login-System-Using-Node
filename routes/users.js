var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User= require ('../models/user');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
var moment = require('moment');
var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



router.get('/register', function(req, res, next) {
  res.render('register');
});
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login',
  passport.authenticate('local',{failureRedirect:'/users/login', failureFlash: 'Invalid username or password'}),
   function(req, res) {
    req.flash('success', 'You are now logged in');
    res.redirect('/');
   
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done){
    User.getUserByUsername(username, function(err, user){
     if(err) throw err;
     if(!user){
      return done(null, false, {message: 'Unknown User'});
     }

    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      } 
       else {
        return done(null, false, {message:'Invalid Password'});
      }
    });
  });
}));



router.post('/register', function(req, res, next) {
 var username = req.body.username;
 var email = req.body.email;
 var password = req.body.password;
 //validating the form
 req.checkBody('username','Enter Userame').notEmpty();
 req.checkBody('email','Enter a valid Email').isEmail();
 req.checkBody('password','Enter password').notEmpty();
 //to check if username is taken
/* req.checkBody('username', 'Username already exists').custom(usernames => {
  User.findOne({username: username}).exec(function(user) {
      if (user) {
          throw new Error('this username is already in use');
      }
  })
});*/
 
//Checking for errors
 var errors =req.validationErrors();
 if(errors){
   res.render('register',{
     errors:errors
   })
 } else{
   var newUser=new User({
     username : username,
     email : email,
     password : password,
     time: mysqlTimestamp,
   });
   User.createUser(newUser,function(err,user){
     if(err) throw err;
     console.log(user);
   });
     const msg = {
      to: email,
      from: 'emil.francis@gmail.com',
      subject: 'Account Created',
      text: 'Hey '+username+' Your Account has been Successfully created!',
      };
      sgMail.send(msg);  
  req.flash('success','You Are now registered and can login');
  res.location('/users/login');
  res.redirect('/users/login');
 }

});
router.get('/logout',function(req,res){
  req.logout();
  req.flash('success','You are now logged out');
  res.redirect('/users/login');
});


module.exports = router;