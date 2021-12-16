var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const {body, validationResult} = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const validateToken = require('../auth/validateToken.js');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage});

/* GET users listing. 
router.get('/list', validateToken, (req, res, next) => {
  User.find({}, (err, users) =>{
    if(err) return next(err);
    res.render("users", {users});
  });
}); */

router.get('/register.html', function(req, res, next) {
  res.render("register");
});

router.post('/register',
  upload.none(),
  body("email").isLength({min: 5}).isEmail().trim().escape(),
  body("password").isStrongPassword(),
  (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({message: "Password is not strong enough"});
    }
    User.findOne({email: req.body.email}, (err, user) => {
      if(err) throw err;
      if(user) {
        return res.status(403).json({message: "Email already in use"});
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if(err) throw err;
            User.create(
              {
                email: req.body.email,
                password: hash
              },
              (err, ok) => {
                if(err) throw err;
                return res.json({Success: true});
              }
            );
          });
        });
      }
    });
});

router.get('/login.html', function(req, res, next) {
  res.render("login");
});

router.post('/login',
  body("email").isLength({min: 5}).isEmail().trim().escape(),
  body("password").isLength({min: 8}),
  upload.none(),
  (req, res, next) => {
    User.findOne({email: req.body.email}, (err, user) =>{
      if(err) throw err;
      if(!user) {
        return res.status(403).json({message: "Invalid credentials"});
      } else {
        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
          if(err) throw err;
          if(isMatch) {
            const jwtPayload = {
              id: user._id,
              email: user.email
            }
            jwt.sign(
              jwtPayload,
              process.env.SECRET,
              {
                expiresIn: "5m"
              },
              (err, token) => {
                res.json({success: true, token, email: user.email});
              }
            );
          } else {
            return res.status(403).json({message: "Invalid credentials"});
          }
        });
      }
    });
});

module.exports = router;
