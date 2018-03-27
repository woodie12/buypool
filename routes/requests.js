const express = require('express');
const router = express.Router();
const config = require('../config.js');
const connection = require('../connection');

router.get('/', function(req, res) {
  console.log("get list requests")
  connection.acquire(function(err, con){
    con.query('SELECT * FROM Request', function(err, result) {
        con.release();
        if (err){
          res.send(err);
        }else{
          res.send(result);
        }
      });
  });
});

// used for filtering requests
// search by address, completed, type, userId, url (xxxx or %)
// TODO OR (frontend gives a list of value for each attribute)
router.get('/search', function(req, res) {
  console.log("search request by attributes")
  connection.acquire(function(err, con){
    let isFirst = true;

    let search_query = ' SELECT * FROM Request ';
    if (req.query.address){
      if (isFirst) {search_query += ' WHERE '}
      else {search_query += ' AND '};
      search_query += ' address = "'+req.query.address+'" ';

      isFirst = false;
    };
    if (req.query.completed){
      if (isFirst) {search_query += ' WHERE '}
      else {search_query += ' AND '};
      search_query += ' completed = '+req.query.completed;
      isFirst = false;
    };
    if (req.query.type){
      if (isFirst) {search_query += ' WHERE '}
      else {search_query += ' AND '};
      search_query += ' type = "'+ req.query.type+'" ';
      isFirst = false;
    };
    if (req.query.userId){
      if (isFirst) {search_query += ' WHERE '}
      else {search_query += ' AND '};
      search_query += ' userId = "'+req.query.userId+'" ';
      isFirst = false;
    };
    if (req.query.url){
      if (isFirst) {search_query += ' WHERE '}
      else {search_query += ' AND '};
      search_query += 'url = "'+req.query.url+'" ';
      isFirst = false;
    };

    con.query(search_query,
      function(err, result) {
        con.release();
        if (err){
          res.send(err);
        }else{
          res.send(result);
        }
      });
  });
});

// used for the page of a single request
router.get('/:id', function(req, res) {
  console.log("get request by id")
  connection.acquire(function(err, con){
    con.query('SELECT * FROM Request WHERE requestId = ?', req.params.id,
      function(err, result) {
        con.release();
        if (err){
          res.send(err);
        }else{
          res.send(result);
        }
      });
  });
});

// INSERT INTO table SET a=1, b=2, c=3
// need json in req.body
router.post('/', function(req, res) {
  console.log("post new request")
  connection.acquire(function(err, con) {
    console.log(req.body)
    con.query('INSERT INTO Request (requestId,url,completed,title,type,address,description,userId) VALUES (?,?,?,?,?,?,?,?) ',
    [req.body.requestId, req.body.completed, req.body.url, req.body.title, req.body.type, req.body.address, req.body.description, req.body.userId],
      function(err, result) {

        con.release();
        if (err) {
          res.send(err);
        } else {


          res.send({
            status: 200,
            message: 'Insert to Request successfully.'
          });
        }
      });
  });
});

router.put('/:id', function(req, res) {
  connection.acquire(function(err, con) {
    console.log("update request")
    let update_query = ' UPDATE Request SET ';
    let isFirst = true;

    if (req.body.address){
      if (!isFirst) {update_query += ' , '};
      update_query += ' address = "'+req.body.address+'" ';
      isFirst = false;
    };
    if (req.body.completed){
      if (!isFirst) {update_query += ' , '};
      update_query += ' completed = '+req.body.completed;
      isFirst = false;
    };
    if (req.body.type){
      if (!isFirst) {update_query += ' , '};
      update_query += ' type = "'+ req.body.type+'" ';
      isFirst = false;
    };
    if (req.body.url){
      if (!isFirst) {update_query += ' , '};
      update_query += 'url = "'+req.body.url+'" ';
      isFirst = false;
    };
    if (req.body.title){
      if (!isFirst) {update_query += ' , '};
      update_query += 'title = "'+req.body.title+'" ';
      isFirst = false;
    };
    if (req.body.description){
      if (!isFirst) {update_query += ' , '};
      update_query += 'description = "'+req.body.description+'" ';
      isFirst = false;
    };
    update_query += ' WHERE requestId = ? ';

    con.query(update_query, req.params.id,
      function(err, result) {
        con.release();
        if (err) {
          res.send(err);
        } else {
          res.send({
            status: 200,
            message: 'Update Request successfully'
          });
        }
      });
  });
});

router.delete('/:id', function(req, res) {
  connection.acquire(function(err, con) {
    con.query('DELETE FROM Request WHERE requestId = ?', req.params.id,
      function(err, result) {
        con.release();
        if (err) {
          res.send(err);
        } else {
          res.send({
            status: 200,
            message: 'Delete from Request successfully'});
        }
      });
  });
});

module.exports = router;
