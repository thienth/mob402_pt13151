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
router.get('/list-post', function(req, res, next) {
  var keyword = req.query.keyword == undefined ? "" : req.query.keyword;
  
  var sql = `select 
                  p.*,
                  c.name as catename
              from posts p 
              join categories c
                on p.cate_id = c.id `;
  if(keyword !== ""){
    sql += `where title like '%${keyword}%' or content like '%${keyword}%'`;
  }
  connection.query(sql, function (err, rows, fields) {
    if (err) throw err;

    var data = rows;
    res.json({ data });
  })

  
});
router.get('/list-category', function(req, res, next) {
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
    res.json({ data });
  })

  
});


router.get('/edit/:id', function(req, res, next){
  var sql = `select * from posts where id = ?`;
  var data = [req.params.id];
  connection.query(sql, data, function (err, rows, fields) {
    if (err) throw err;

    var data = rows[0];
    var getCategoryQuery = `select * from categories`;
    connection.query(getCategoryQuery, function (err, rows, fields) {
      if (err) throw err;
      
      res.render('post/post-form', { data, cates: rows });
    });
  })
});

router.get('/remove/:id', function(req, res, next){
  var sql = `delete from posts where id = ?`;
  var data = [req.params.id];
  connection.query(sql, data, function (err, rows, fields) {
    if (err) throw err;

    res.redirect('/');
  })
});

router.get('/add-new', function(req, res, next){
  var getCategoryQuery = `select * from categories`;
  connection.query(getCategoryQuery, function (err, rows, fields) {
    if (err) throw err;
    
    var data = {};
    res.render('post/post-form', { data, cates: rows });
  });
});

router.post('/save', function(req, res, next){
  if(req.body.id !== ""){
    var query = ` update posts
                  set
                    title = ?,
                    cate_id = ?,
                    image = ?,
                    short_desc = ?,
                    content = ?,
                    author = ?

                  where id = ?`;
    var data = [
      req.body.title,
      req.body.cate_id,
      req.body.image,
      req.body.short_desc,
      req.body.content,
      req.body.author,
      req.body.id
    ]
  }else{
    var query = ` insert into posts 
                  ( title, cate_id, image, short_desc, 
                    content, author)
                values (?, ?, ?, ?, ?, ?)`;
    var data = [
      req.body.title,
      req.body.cate_id,
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
