const fs = require('fs');

const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const db = require('./config/db.js');

const loginView = fs.readFileSync(`${__dirname}/templates/login.html`,'utf-8');

app.get('/login',(req, res) => {
  res.send(loginView);
})

app.get('/add',(req, res) => {
  // app.use(bodyParser.urlencoded({extended: true}));
  var name = req.query.fullname;
  var email = req.query.email;
  var password = req.query.password;
  var confirmpassword = req.query.confirmpassword;

  var sql = `INSERT into user (name,email,password) VALUES ('${name}','${email}','${password}')`;


  db.query(sql, function(err, result) {
    if(err){
      res.send('Something went wrong');
    }else{
      res.redirect('/login');
    }
  })
})

app.listen(8000, 'localhost', () => {
  console.log('loading please wait');
});