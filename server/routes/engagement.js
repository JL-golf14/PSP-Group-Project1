var express = require('express');
var router = express.Router();
var pool = require('../modules/database-config');

//*****************************************//
//              ADDING IDEAS             //
//*****************************************//

//adds new idea to DB
router.post('/newidea', function (req, res) {
  if(req.decodedToken.userSQLId) {
  var newIdea = req.body;
  pool.connect()
    .then(function (client) {
      client.query('INSERT INTO ideas (title, description, subtopics_id, user_id) VALUES ($1, $2, $3, $4)',
        [newIdea.title, newIdea.description, newIdea.subtopicId, req.decodedToken.userSQLId])
        .then(function (result) {
          client.release();
          res.sendStatus(201);
        })
        .catch(function (err) {
          console.log('error on INSERT', err);
          res.sendStatus(500);
        });
    });//end of .then
  }
});//end of router.post

//*****************************************//
//               COMMENTING                //
//*****************************************//

//adds comments to DB
router.post('/addComment', function (req, res) {
  if(req.decodedToken.userSQLId) {
  var newComment = req.body;
  // console.log('newComment: ', newComment);
  pool.connect()
    .then(function (client) {
      client.query('INSERT INTO comments (description, idea_id, user_id) VALUES ($1, $2, $3)',
        [newComment.description, newComment.idea_id, req.decodedToken.userSQLId ])
        .then(function (result) {
          client.release();
          res.sendStatus(201);
        })
        .catch(function (err) {
          console.log('error on INSERT', err);
          res.sendStatus(500);
        });
    });//end of .then
  }
  });//end of router.post


//adds new sub-comment to DB
router.post('/addNewSubcomment', function (req, res) {
  if(req.decodedToken.userSQLId) {
  var newSubComment = req.body;
  var token = req.params; //this is were im stuck!!
  // console.log('token: ', token);
  pool.connect()
    .then(function (client) {
      client.query('INSERT INTO subcomments (description, user_id, comment_id) VALUES ($1, $2, $3)',
        [newSubComment.description, newSubComment.user_id, newSubComment.comment_id])
        .then(function (result) {
          client.release();
          res.sendStatus(201);
        })
        .catch(function (err) {
          console.log('error on INSERT', err);
          res.sendStatus(500);
        });
    });//end of .then
  }
});//end of router.post

//adds like to ideas_likes table
router.put('/addIdeaLike/:id', function(req, res){
  var ideaId = req.params.id;
    // var userId = req.decodedToken.userSQLId;
  pool.connect(function (err, client, done) {
    client.query('SELECT * FROM ideas_likes WHERE user_id=$1 AND idea_id=$2;', [req.decodedToken.userSQLId, ideaId], function(err, result){
      done();
      if(err){
        ('Error on ideas_likes user check query', err);
      } else {
        if (result.rows.length == 0){
          pool.connect(function (err, client, done) {
            client.query('INSERT INTO ideas_likes (user_id, idea_id) VALUES ($1, $2);', [req.decodedToken.userSQLId, ideaId], function(err, result){
              done();
              if(err){
                ('Error ideas_likes insert', err);
                res.sendStatus(500);
              } else {
                res.sendStatus(200);
              }
            });
          });
        }else{
          console.log('rows length', result.rows.length);
          res.sendStatus(403);
        }
      }
    });
  });
});

//adds like to ideas_likes table
router.put('/addIdeaLove/:id', function(req, res){
  var ideaId = req.params.id;
    // var userId = req.decodedToken.userSQLId;
  pool.connect(function (err, client, done) {
    client.query('SELECT * FROM ideas_loves WHERE user_id=$1 AND idea_id=$2;', [req.decodedToken.userSQLId, ideaId], function(err, result){
      done();
      if(err){
        ('Error on ideas_loves user check query', err);
      } else {
        if (result.rows.length == 0){
          pool.connect(function (err, client, done) {
            client.query('INSERT INTO ideas_loves (user_id, idea_id) VALUES (4, $1);', [ideaId], function(err, result){
              done();
              if(err){
                ('Error ideas_loves insert', err);
                res.sendStatus(500);
              } else {
                res.sendStatus(200);
              }
            });
          });
        }else{
          res.sendStatus(403);
        }
      }
    });
  });
});

//adds like to comments_likes table
router.put('/addCommentLike/:id', function(req, res){
  var commentId = req.params.id;
  pool.connect(function (err, client, done) {
    client.query('SELECT * FROM comments_likes WHERE user_id=$1 AND comment_id=$2;', [req.decodedToken.userSQLId, commentId], function(err, result){
      done();
      if(err){
        ('Error comments_likes user check query', err);
      } else {
        if (result.rows.length == 0){
          pool.connect(function (err, client, done) {
            client.query('INSERT INTO comments_likes (user_id, comment_id) VALUES (4, $1);', [commentId], function(err, result){
              done();
              if(err){
                ('Error comments_likes insert', err);
                res.sendStatus(500);
              } else {
                res.sendStatus(200);
              }
            });
          });
        }else{
          res.sendStatus(403);
        }
      }
    });
  });
});

module.exports = router;
