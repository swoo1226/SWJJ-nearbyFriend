var express = require('express')
var app = express()
var router = express.Router()
var mysql = require('mysql')
var path = require('path')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy


const connection = mysql.createConnection({
  host      : 'localhost',
  user      : 'root',
  password  : 'k6720106',
  database  : 'myproject'
});


connection.connect();




router.get('/',function(req,res) {
  console.log('get join url')
  var msg;
  var errMsg = req.flash('error')
  if(errMsg) msg = errMsg;
  res.render('join.ejs',{'message' : msg})
})



passport.serializeUser(function (user, done) {
  console.log('passport session save ', user.id)
  done(null, user.email);
});

passport.deserializeUser(function(id, done) {
  console.log('passport dess', id)
  done(null,id);
})

//수정 해야함 ***
passport.use('local-join', new LocalStrategy({
  usernameField : 'userName',
  passwordFiled : 'password',
  passReqToCallback : true
}, function(req, email, password, done) { //done 을 사용하면 비동기 가 멈춘다
  var userName = req.body.userName;
  connection.query(`SELECT * FROM userlist WHERE userName = ? `,[userName],function(err,rows) {
    if(err) throw done(err);
    if(rows.length) {
      if(rows[0].password === password) {
        return done(null,{'email' : email, 'id' : rows[0].id});
      } else {
        return done(null,false,{message : " password 가 틀렷어 "})
      }
    } else {
      return done(null,false,{message : "email 이 틀렷어"})
    }
  })
}
))
//***

router.post('/',
  passport.authenticate('local-join', { 
    successRedirect : '/',
    failureRedirect : '/join',
    failureFlash : true})
);



// router.post('/',function(req,res) {
//   email = req.body.email;
//   password = req.body.password;
//   var result = {};
//   connection.query(`SELECT * FROM identity WHERE email = ? `,email,function(err,rows) {
//     if(err) throw err;
//     if(rows[0]) {
//       if(rows[0].password === password) {
//         result.send = email;
//         result.info = true;
//         res.send(result);
//       } else {
//         result.send = email;
//         result.info = false;
//         res.send(result)
//       }
//     }
//     else {
//       result.send = false;
//       res.send(result);
//     }
//   })
// })

module.exports = router;
