var express = require('express');
var app = express();
var route = require('./route');

app.use(route);
// // var multer = require('multer');
// var bodyParser = require('body-parser');
// // var upload = multer();

// // app.set('view engine', 'pug');
// // app.set('views', './views');

// // app.get('/', (req, res) => {
// //     res.render('form');
// // })

// // app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({ extended: true })); 


// // app.post('/', (req, res) => {
// //     console.log(req.body);
// //     res.send('ok');
// // })

// var cookies = require('cookie-parser');
// const cookieParser = require('cookie-parser');
// app.use(cookieParser());

// var session = require('express-session');
// app.use(session({secret: "Shh, its a secret!"}));
// app.get('/',(req, res) => {
//     console.log('Cookies: ', req.cookies);
//     res.cookie('kimkhanh', 'value', {maxAge: 360000 }).send('cookie set');
// })

// app.get('/clear_cookie_foo', function(req, res){
//     res.clearCookie('kimkhanh');
//     res.send('cookie foo cleared');
//  });
 
//  app.get('/session', function(req, res){
//     if(req.session.page_views){
//        req.session.page_views++;
//        res.send("You visited this page " + req.session.page_views + " times");
//     } else {
//        req.session.page_views = 1;
//        res.send("Welcome to this page for the first time!");
//     }
//  });


//  var Users = [];
//  app.get('/signup', function(req, res){
//     res.render('signup');
//  });
 
//  app.post('/signup', function(req, res){
//     if(!req.body.id || !req.body.password){
//        res.status("400");
//        res.send("Invalid details!");
//     } else {
//        Users.filter(function(user){
//           if(user.id === req.body.id){
//              res.render('signup', {
//                 message: "User Already Exists! Login or choose another user id"});
//           }
//        });
//        var newUser = {id: req.body.id, password: req.body.password};
//        Users.push(newUser);
//        req.session.user = newUser;
//        res.send('ok')
//     }
//  });

//  app.post('/login', function(req, res){
//     console.log(Users);
//     if(!req.body.id || !req.body.password){
//        res.render('login', {message: "Please enter both id and password"});
//     } else {
//        Users.filter(function(user){
//           if(user.id === req.body.id && user.password === req.body.password){
//              req.session.user = user;
//              res.send('ok signin')
//           }
//        });
//        res.render('login', {message: "Invalid credentials!"});
//     }
//  });
app.listen(3000);