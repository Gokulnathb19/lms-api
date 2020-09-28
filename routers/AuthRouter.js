var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('../model/User');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
const {JWT_SECRET} = config;

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/login', (req, res) => {
  const password = req.body.password ? req.body.password : ''
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return res.status(500).send("Internal server error")
    if (!user) return res.status(404).send("User not found")
    
    var passwordIsValid = bcrypt.compareSync(password, user.password)
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null })

    var token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: 86400 })

    res.status(200).send({ auth: true, token: token })
  })
})

module.exports = router