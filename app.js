// Modules
const fs = require('fs');

const db = require('./config/db.js');

const express = require('express');

const bodyParser = require('body-parser');

const session = require('express-session');

const cookieParser = require('cookie-parser');

const bcrypt = require('bcrypt');

const nodemailer = require('nodemailer');

const app = express();

const port = process.env.PORT || 8000;

//middlewares

app.use(bodyParser.urlencoded({ extended:true }));

app.use(bodyParser.json());

const oneDay = 1000 * 24 * 60 * 60;
app.use(session({
  secret: "bfjhsdfgdfgdjfg",
  saveUninitialized: true,
  cookie: { maxage: oneDay },
  resave: false

}));

app.use(cookieParser());


const loginView = fs.readFileSync(`${__dirname}/templates/login.html`,'utf-8');

const detailsView = fs.readFileSync(`${__dirname}/templates/registerDetails.html`,'utf-8');

const editDetails = fs.readFileSync(`${__dirname}/templates/editDetails.html`,'utf-8')

app.get('/login', (req, res) => {
  // console.log(req.session);
  res.send(loginView);
})

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
})

app.post('/submitLogin', (req, res) => { 
  var username = req.body.username;
  var password = req.body.password;

  var sql = `SELECT * from user where name = '${username}' and active_status='1'`;

  db.query(sql, (err, result) => { 
    if (err) {
      res.status(404).send('Something went wrong');
    } else {
      if (result != '') {

        bcrypt.compare(password, result[0].password, (err, hash) => {
          if (err) {
            console.log('something went wrong');
          } else if (hash) {

            console.log('User can login now..!');
             req.session.username = result[0].name;
              req.session.password = result[0].password;
              req.session.role = result[0].role;
              req.session.save();
              res.redirect('/registerDetails');
          } else {
            console.log('password is incorrect');
            res.redirect('/login');
          }
        });       
      } else {
        res.send('Username or password is incorrect');
      }      
    }
  })
})

app.post('/add',(req, res) => {
  // app.use(bodyParser.urlencoded({extended: true}));
  // console.log(req.body);
  var name = req.body.fullname;
  var email = req.body.email;

  const saltRound = 10;

  var password = bcrypt.hash(req.body.password, saltRound, (err, hash) => {
    if (err) {
      res.status(404).send('Invali password');
    } else {
      var sql = `INSERT into user (name,email,password,role) VALUES ('${name}','${email}','${hash}','2')`;

      db.query(sql, function(err, result) {
        if(err){
          res.send('Something went wrong');
        } else {
          const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'dineshkumar2001jan@gmail.com',
                    pass: 'pxwsabobaplsrdzq'
                }
            });

            // Simulate a successful login
            const userEmailAddress = email;

            const loginSuccessfulEmail = {
                from: 'dineshkumar2001jan@gmail.com',
                to: userEmailAddress,
                subject: 'Registration Successful',
                text: 'You have successfully Register in to our application.'
            };

            transporter.sendMail(loginSuccessfulEmail, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                  console.log('Email sent:', info.response);
                  res.redirect('/login');
                }
            });
          
        }
      })
    }
  });
  // var confirmpassword = req.body.confirmpassword;
})

app.get('/edit/:id',(req, res) => {
  res.send(editDetails);
})

app.get('/registerDetails', (req, res) => {
  // console.log(req.session);
  if (req.session.role) {
    res.send(detailsView);    
  } else {
    res.redirect('/login');    
  }
})

app.get('/api/v1/registerDetails', (req, res) => {
  
  if (req.session.role == 2) {
    var sql = `SELECT * from user where name='${req.session.username}' and password='${req.session.password}' and active_status='1'`;
  } else {
    var sql = `SELECT * from user where active_status='1'`;
  }
  
  db.query(sql, function(err, result) {
    if(err){
      res.status(404).send('something went wrong');
    }else{
      const users = JSON.stringify(result);
      res.send(users);
    }
  })
})

app.get('/api/v1/fetchDetails/:id',(req, res) => {
  var sql = `SELECT * from user where id='${req.params.id}'`;

  db.query(sql, (err, result) => {
    if(err){
      res.status(404).send('something went wrong');
    }else{
      res.send(result);
    }
  })
})

app.post('/updateDetails',(req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const id = req.body.user_id;

  var sql = `UPDATE user SET name="${name}",email="${email}",password="${password}" where id="${id}"`;

  db.query(sql, (err, result) => {
    if(err){
      res.status(404).send('something went wrong');
    }else{
      res.redirect('/registerDetails');
    }
  })
})

app.get('/delete/:id', (req, res) => {
  const status = '2';

  var sql = `UPDATE user set active_status="${status}" where id="${req.params.id}"`;

  db.query(sql, (err, result) => {
    if(err){
      res.status(404).send('Something went wrong');
    }else{
      res.redirect('/registerDetails');
    }
  })
})

app.listen(port, 'localhost', () => {
  console.log('loading please wait');
});

