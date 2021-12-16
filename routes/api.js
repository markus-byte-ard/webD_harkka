var express = require('express');
var router = express.Router();
const validateToken = require('../auth/validateToken.js');
const jwt = require('jsonwebtoken');
const {body, validationResult} = require('express-validator');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage});

router.get('/posts', (req, res, next) => {
  Post.find({}, (err, posts) => {
    if(err) return next(err);
    console.log(posts);
    res.render("posts", {posts})
  })
});

router.get('/comments.html', (req, res, next) => {
    res.render("comments");
});

router.post('/posts', upload.none(), (req, res, next) => {
  try {
    console.log(req.body);
    Post.findOne({title: req.body.title}, (err, post) => {
      if(err) throw err;
      if(post) {
        return res.status(403).json({message: "Title is already in use"});
      } else {
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

router.get("/posts/:title", (req, res, next) => {
  const name = req.params.title;
  console.log(name);
  Post.findOne( {title: new RegExp(name, "i")}, (err, post) => {
    console.log(post);
    if(err) return next(err);
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

router.post('/comments', upload.none(), (req, res, next) => {
  try {
    console.log(req.body);
    Post.create(
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