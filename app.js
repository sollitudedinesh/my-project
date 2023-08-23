const fs = require('fs');

const db = require('./config/db.js');

const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const port = 8000;

app.use(bodyParser.urlencoded({ extended:true }));

app.use(bodyParser.json());

app.listen(8000, 'localhost', () => {
  console.log('loading please wait');
});

const loginView = fs.readFileSync(`${__dirname}/templates/login.html`,'utf-8');

const detailsView = fs.readFileSync(`${__dirname}/templates/registerDetails.html`,'utf-8');

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

app.get('/fetchUser/:id',(req, res) => {
  var id = req.params.id;
  var sql = `SELECT * from user where id=${id}`;
  db.query(sql, (err, result) => {
    if(err){
      res.send(err);
    }else{
      res.send(JSON.stringify(result));
    }
  })
})

app.get('/registerDetails',(req, res) => {
  res.send(detailsView);
})

app.get('/api/v1/registerDetails',(req, res) => {
  var sql = `SELECT * from user`;
  db.query(sql, function(err, result) {
    if(err){
      res.status(404).send('something went wrong');
    }else{
      const users = JSON.stringify(result);
      res.send(users);
    }
  })
})

