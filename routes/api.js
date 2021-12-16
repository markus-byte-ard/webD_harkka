var express = require('express');
var router = express.Router();
const validateToken = require('../auth/validateToken.js');
const jwt = require('jsonwebtoken');
const {body, validationResult} = require('express-validator');
const User = require('../models/User');
const Post = require('../models/Post');
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
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;