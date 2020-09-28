var jwt = require('jsonwebtoken');
var config = require('../config');
const {JWT_SECRET} = config;

module.exports = (req, res, next) => {
  if (!req.headers['authorization']) {
    res.status(401).send("Unauthenticated")
  } else {
    jwt.verify(req.headers['authorization'], JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(403).send("Forbidden")
      } else {
        req.userId = decoded.id,
        req.role = decoded.role
        next()
      }
    })
  }
}
