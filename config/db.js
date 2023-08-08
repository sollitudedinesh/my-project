const mysql = require('mysql');

const connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'',
  database:'my_db'
});

connection.connect(function (err){
  if(err){
    console.log(err);
  }else{
    console.log('Connected successfully:)');
  }
})

module.exports = connection;