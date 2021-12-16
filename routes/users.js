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

// GET register site
router.get('/register.html', function(req, res, next) {
  res.render("register");
});

// POST for creating new users tests if password is strong
router.post('/register',
  upload.none(),
  body("email").isLength({min: 5}).isEmail().trim().escape(),
  body("password").isStrongPassword(),
  (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({message: "Password is not strong enough"});
    }
    // If no errors in inputs try to find if user already exists
    User.findOne({email: req.body.email}, (err, user) => {
      if(err) throw err;
      if(user) {
        return res.status(403).json({message: "Email already in use"});
      } else {
        // If user didn't exist hash and salt password for safety
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if(err) throw err;
            // If no errors ocurred during hashing and salting create a new User
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

// GET for login
router.get('/login.html', function(req, res, next) {
  res.render("login");
});

// POST for authorisation and login inputs are first checked to see if they are valid
router.post('/login',
  body("email").isLength({min: 5}).isEmail().trim().escape(),
  body("password").isLength({min: 8}),
  upload.none(),
  (req, res, next) => {
    // Try to find the user
    User.findOne({email: req.body.email}, (err, user) =>{
      if(err) throw err;
      if(!user) {
        return res.status(403).json({message: "Invalid credentials"});
      } else {
        // User was found so compare encrypted password with encrypted input
        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
          if(err) throw err;
          // If passwords match create a jwt and sign it
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
