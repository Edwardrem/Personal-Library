/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
       
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentCount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'book_title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title: 'Test title'})
          .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.book_title, 'Test title');
          done();
        })
        
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send()
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Please provide book title');
            done();
        })
      });
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .query({})
          .end(function(err, res){
            assert.equal(res.status,200);
            assert.isArray(res.body);
        })
        done();
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/111111111111111111111111')
          .query({})
          .end(function(err, res){
            assert.equal(res.status,200);
            assert.equal(res.body.error, 'Book could not be found');
            done();
        })
        
        
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/5c3fca442a3c5d57ed06b7df')
          .query({})
          .end(function(err, res){
            assert.equal(res.status,200);
            assert.equal(res.body[0]._id, '5c3fca442a3c5d57ed06b7df');
            done();
        })
        
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
          chai.request(server)
            .post('/api/books/5c3fca442a3c5d57ed06b7df')
            .send({ comment: "test comment" })
            .end(function(err, res){
              assert.equal(res.status,200);
              assert.equal(res.body[0]._id, '5c3fca442a3c5d57ed06b7df');
              assert.property(res.body[0], 'book_title', 'Books in array should have book_title property');
              assert.property(res.body[0], 'comment', 'Books in array should have comment property');
          })
        done();
      });
      
    });

  });

});
