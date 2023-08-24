const fs = require('fs');

const db = require('./config/db.js');

const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended:true }));

app.use(bodyParser.json());

app.listen(port, 'localhost', () => {
  console.log('loading please wait');
});

const loginView = fs.readFileSync(`${__dirname}/templates/login.html`,'utf-8');

const detailsView = fs.readFileSync(`${__dirname}/templates/registerDetails.html`,'utf-8');

const editDetails = fs.readFileSync(`${__dirname}/templates/editDetails.html`,'utf-8')

app.get('/login',(req, res) => {
  res.send(loginView);
})

app.post('/add',(req, res) => {
  // app.use(bodyParser.urlencoded({extended: true}));
  console.log(req.body);
  var name = req.body.fullname;
  var email = req.body.email;
  var password = req.body.password;
  // var confirmpassword = req.body.confirmpassword;

  var sql = `INSERT into user (name,email,password) VALUES ('${name}','${email}','${password}')`;


  db.query(sql, function(err, result) {
    if(err){
      res.send('Something went wrong');
    }else{
      res.redirect('/login');
    }
  })
})

app.get('/edit/:id',(req, res) => {
  res.send(editDetails);
})

app.get('/registerDetails',(req, res) => {
  res.send(detailsView);
})

app.get('/api/v1/registerDetails',(req, res) => {
  var sql = `SELECT * from user where active_status='1'`;
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

