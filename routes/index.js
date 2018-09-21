var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '123456',
  database : 'mob402'
});

connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
  var keyword = req.query.keyword == undefined ? "" : req.query.keyword;
  
  var sql = `select * from posts `;
  if(keyword !== ""){
    sql += `where title like '%${keyword}%' or content like '%${keyword}%'`;
  }
  connection.query(sql, function (err, rows, fields) {
    if (err) throw err;

    var data = rows;
    res.render('welcome', { data });
  })

  
});

router.get('/remove/:id', function(req, res, next){
  var sql = `select * from posts where id = ?`;
  var data = [req.params.id];
  connection.query(sql, data, function (err, rows, fields) {
    if (err) throw err;

    var data = rows[0];
    
    res.render('post/post-form', { data });
  })
});

router.get('/add-new', function(req, res, next){
  var data = {};
  res.render('post/post-form', { data });
});

router.post('/add-new', function(req, res, next){
  var insertQuery = `insert into posts 
                      (title, image, short_desc, content, author)
                     values (?, ?, ?, ?, ?)`;
  var data = [
    req.body.title,
    req.body.image,
    req.body.short_desc,
    req.body.content,
    req.body.author
  ];
  connection.query(insertQuery, data, function (err, rows, fields) {
    if (err) throw err;

    console.log(rows, fields);
    res.redirect('/');
  })
});
module.exports = router;
