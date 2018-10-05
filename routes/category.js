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
  
  var sql = `select c.*,
                  (select count(*) 
                    from posts 
                    where cate_id = c.id) as totalPost
             from categories c `;
  if(keyword !== ""){
    sql += `where name like '%${keyword}%'`;
  }
  connection.query(sql, function (err, rows, fields) {
    if (err) throw err;

    var data = rows;
    res.render('category/index', { data });
  })

  
});

router.get('/edit/:id', function(req, res, next){
  var sql = `select * from posts where id = ?`;
  var data = [req.params.id];
  connection.query(sql, data, function (err, rows, fields) {
    if (err) throw err;

    var data = rows[0];

    res.render('post/post-form', { data });
  })
});

router.get('/remove/:id', function(req, res, next){
  var deletePostQuery = `delete from posts where cate_id = ${req.params.id}`;

  var deleteCateQuery = `delete from categories where id = ${req.params.id}`;
  
  connection.query(deletePostQuery, function (err, rows, fields) {
    if (err) throw err;

    connection.query(deleteCateQuery, function(err, rows, fields){
      if (err) throw  err;
      res.redirect('/categories');
    });
  })
});

router.get('/add-new', function(req, res, next){
  var data = {};
  res.render('post/post-form', { data });
});

router.post('/save', function(req, res, next){
  if(req.body.id !== ""){
    var query = ` update posts
                  set
                    title = ?,
                    image = ?,
                    short_desc = ?,
                    content = ?,
                    author = ?

                  where id = ?`;
    var data = [
      req.body.title,
      req.body.image,
      req.body.short_desc,
      req.body.content,
      req.body.author,
      req.body.id
    ]
  }else{
    var query = ` insert into posts 
                  ( title, image, short_desc, 
                    content, author)
                values (?, ?, ?, ?, ?)`;
    var data = [
      req.body.title,
      req.body.image,
      req.body.short_desc,
      req.body.content,
      req.body.author
    ];
  }
  
  connection.query(query, data, function (err, rows, fields) {
    if (err) throw err;

    console.log(rows, fields);
    res.redirect('/');
  })
});
module.exports = router;
