const jwt = require('jsonwebtoken');
// Simple middleware to validate tokens
// Exactly as is in week 7 course material
module.exports = function (req, res, next) {
    const authHeader = req.headers["authorization"];
    let token;
    if(authHeader) {
        token = authHeader.split(" ")[1];
    } else {
        token = null;
    }
    if(token == null) return res.sendStatus(401);
    console.log("Token found");
    jwt.verify(token, process.env.SECRET, (err, user) => {
        if(err) return res.sendStatus(401);
        req.user = user;
        next();
    });
};