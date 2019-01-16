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
    
    let query = {};
    function responseCallback(obj){

      res.send(obj);
    };
    
    function connectAndFind(query, callback) {
      let responseObj;
      conn.then(function(client){
      client.db(dbName)
            .collection('Library')
            .find(query).toArray(function(error, result){
              if (error) { return console.log('Error in finding book'); }
              if (!result) { 
                responseObj = 'No book exists';
              } else {
                result.forEach(function(doc) {
                  if (doc.comment) {
                    doc.commentCount = doc.comment.length;
                  };
                  
                  if (!doc.comment) {
                    doc.commentCount = 0;
                  };
                
                })
                
                
                responseObj = result;
              }
              callback(responseObj);
            })
      });
    };
    
    // Build query document
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
      
      // Check that bookId provided in the form is a valid ObjectId input argument
      let checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
      if (!checkForHexRegExp.test(req.params.id)) {
        return res.send({"error": "Please provide valid book _id"});
      };
    
      //res.send('GET :id request received');
      var bookid = ObjectId(req.params.id);
      let query = { _id: bookid };
    
      function responseCallback(obj){
        res.send(obj);
      };

      function connectAndFind(query, callback) {
        let responseObj;
        conn.then(function(client){
        client.db(dbName)
              .collection('Library')
              .find(query).toArray(function(error, result){
                if (error) { return console.log('Error in finding book'); }
                if (result.length == 0) { 
                  responseObj = 'Book could not be found';
                } else {
                  result.forEach(function(doc) {
                    if (!doc.comment || doc.comment.length == 0) {
                      doc.comment = [];

                    }
                    
                  })
                  responseObj = result;
                }
                callback(responseObj);
              })
        });
      };

      // Build query document
      connectAndFind(query, responseCallback);
    
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      console.log(req.params.id);
      // Check that bookId provided in the form is a valid ObjectId input argument
      let checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
      if (!checkForHexRegExp.test(req.params.id)) {
        return res.send({"error": "Please provide valid book _id"});
      };
    
      var bookId = { _id: ObjectId(req.params.id) };
      var comment = req.body.comment;
    
      let update = { $push: { comment: comment } };
    
      function responseCallback(obj){
        if (obj.error) {
          res.send(obj);
        }
        
        if (obj._id) {
          res.redirect('/api/books/' + obj._id);
        }
        
      }
    
      function connectAndAddComment(bookId, update, callback){
        conn.then(function(client){
          let responseObj = {};
          
          client.db(dbName)
                .collection('Library')
                .findOneAndUpdate(bookId, update, { returnOriginal: false }, function(error, result) {
                  if (error || result.value == null || result.lastErrorObject.updatedExisting == false) {
                    responseObj = {'error': 'Could not add comment' };
                    
                  }
            
                  if (result.value != null && result.ok == 1) {
                    responseObj = bookId;
                  }
            
                  return callback(responseObj);
            
                  
          })
          
        })
      }
      connectAndAddComment(bookId, update, responseCallback);
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      console.log(bookid);
      
      function connectAndRemove(bookID, callback){
        let message = '';
        conn.then(function(client){
          client.db(dbName)
                .collection('Library')
                .deleteOne({_id: bookID}, function(error, result){
                  if (error || result.result.n == 0) {
                    message = 'Could not delete ' + bookID;
                  };
            
            
                  if (result.result.n == 1 && result.result.ok == 1){
                    message = 'deleted ' + bookID;
                  };
            
                  
                })
        })
      
      }
      //if successful response will be 'delete successful'
    });
  
};
