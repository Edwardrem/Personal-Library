/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

'use strict';
require('dotenv').config();

// Bring in the packages
const expect      = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;
const ObjectId    = require('mongodb').ObjectID;
const assert      = require('assert');
const Logger      = require('mongodb').Logger;

// Bring in the env variables
const MONGO_URI   = process.env.MONGO_URI;
const URL         = process.env.URL;
const dbName      = process.env.DB;

// Bring in the Schema
const bookSchema = require('../models/books.js');

// Create MongoClient connection to the mLab URL
const conn = MongoClient.connect(MONGO_URI, { useNewUrlParser: true});

// Consider emitting messages during client events
// http://mongodb.github.io/node-mongodb-native/3.1/reference/management/sdam-monitoring/

conn.then(function(client) {
  client.db(dbName)
        .createCollection('Library', {
            validator: {
              $jsonSchema: {
                bookSchema
              }
            }
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
    })
    
    .post(function (req, res){
      //res.send('POST request received');
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      //console.log(req.body);
      console.log('delete pressed');
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
