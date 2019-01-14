/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const MONGO_URI   = process.env.MONGO_URI;
const dbName = process.env.DB;
const assert = require('assert');
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
const bookSchema = require('../models/books.js');
const conn = MongoClient.connect(MONGO_URI, { useNewUrlParser: true});


conn.then(function(client) {
  client.db(dbName)
        .createCollection('Library', {
            validator: {
              $jsonSchema: bookSchema
            },
            validationAction: "warn"
        }, function(err, coll) {
            assert.equal(null, err);
            return;
        })
});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //res.send('GET request received');
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    function responseCallback(obj){
      res.send(obj);
    };
    
    function connectAndFind(query, callback) {
      conn.then(function(client){
      client.db(dbName)
            .collection('Library')
            .find(query).toArray(function(error, result){
              if (error) { return console.log('Error finding docs: ' + error); }
              for (let idx in result) {
                if (result[idx].comment) {
                  //console.log(result[idx].comment);
                  result[idx].commentCount = result[idx].comment.length;
                }
              }
              callback(result);
            })
      });
    };
    
    connectAndFind({}, responseCallback);
    
  
  })
    
    .post(function (req, res){
    
      let message = {};
      var title = req.body.title;
      conn.then(function(client){
        client.db(dbName)
          .collection('Library')
          .insertOne({book_title: title, comment:[]}, function(err, data){
            if (err) { message = {"error": "Book could not be added"}; }
            message = { book_title: title, _id: data._id};
            res.send(message);
        })
      })
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      //console.log(req.body);
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      //res.send('GET :id request received');
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
