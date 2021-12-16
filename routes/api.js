var express = require('express');
var router = express.Router();
const validateToken = require('../auth/validateToken.js');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage});

// GET posts finds all posts in posts database
router.get('/posts', (req, res, next) => {
  Post.find({}, (err, posts) => {
    if(err) return next(err);
    console.log(posts);
    // Renders posts pug file and sends posts as parameter
    res.render("posts", {posts})
  })
});

// POST to create new posts
router.post('/posts', upload.none(), (req, res, next) => {
  try {
    console.log(req.body);
    // Decided to make title unique to make showing comments easier
    Post.findOne({title: req.body.title}, (err, post) => {
      if(err) throw err;
      // If post already exists return error
      if(post) {
        return res.status(403).json({message: "Title is already in use"});
      } else {
        // Else create a new post
        Post.create(
          {
            title: req.body.title,
            body: req.body.body,
            user: req.body.email
          },
          (err, ok) => {
            if(err) throw err;
            return res.json({Success: true});
          }
        );
      }
    });
  } catch (err) {
    console.error(err);
  }
});

// GET for single post and showing comments
router.get("/posts/:title", (req, res, next) => {
  // Get name from parameter
  const name = req.params.title;
  console.log(name);
  // Try to find post with said title
  Post.findOne( {title: new RegExp(name, "i")}, (err, post) => {
    console.log(post);
    if(err) return next(err);
    // if post is found search for comments
    if(post) {
      Comment.find( {commentFor: new RegExp(name, "i")}, (err, comments) => {
        if(err) return next(err);
        if(comments) {
          return res.render("comments", {post, comments})
        } else{
          res.status(404).send("There are no comments for snippet with title " + name);
          return res.render("comments", {post, comments})
        }
      });
    } else{
      return res.status(404).send("There is no snippet with title " + name);
    }
  });
});

// POST for creating new comments
router.post('/comments', upload.none(), (req, res, next) => {
  try {
    console.log(req.body);
    // Create new comment
    Comment.create(
      {
        commentFor: req.body.commentFor,
        body: req.body.body,
        user: req.body.email
      },
      (err, ok) => {
        if(err) throw err;
        return res.json({Success: true});
      }
    );
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;