const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
var jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('./../model/User')
const Customer = require('./../model/Customer')
var config = require('../config')
const {JWT_SECRET} = config

router.get('/', (req, res) => {
    const match = {}
    if(req.role === 'agent') {
        match.role = {
            $ne: 'admin'
        }
    }
    User.aggregate([
        {
            $match: match
        },
        {
            $lookup: {
                from: "customers",
                localField: "_id",
                foreignField: "customerId",
                as: "userProfile"
            }
        },
        {
            $project: {
                password: 0,
                userProfile: {
                    customerId: 0
                }
            }
        }
    ])
    
    .exec()
    .then(users => {
        res.send(users)
    })
    .catch(er => {
        res.status(500).json({
            error: er
        })
    })
})

router.get('/:id', (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id)
    const match = {
        _id: id,
    }
    if(req.role === 'agent') {
        match.role = {
            $ne: 'admin'
        }
    }
    User.aggregate([
        {
            $match: match
        },
        {
            $lookup: {
                from: "customers",
                localField: "_id",
                foreignField: "customerId",
                as: "userProfile"
            }
        },
        {
            $project: {
                password: 0,
                userProfile: {
                    customerId: 0
                }
            }
        }
    ])
    .exec()
    .then(users => {
        res.send(users[0])
    })
    .catch(er => {
        res.status(500).json({
            error: er
        })
    })
})

router.post('/addDetails/:id', (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id)
    const customerDetails = req.body
    customerDetails.customerId = id
    const customer = new Customer(customerDetails)
    customer.save()
    .then(customer => {
        res.send({success: true, message: "Customer Details has been updated successfully"})
    })
    .catch(er => {
        res.status(500).json({
            error: er
        })
    })
})

router.put('/updateDetails/:id', (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id)
    const customerDetails = req.body
    customerDetails.customerId = id
    
    Customer.update({customerId: id}, customerDetails, (err, raw) => {
        if(err) {
            res.send(500).send({status: 'error', error: err})
        }
        const {nModified: n} = raw
        res.send({status: (n > 0) ? `Updated ${n} docs successfully` : 'No Changes detected'})
    })
})

router.put('/:id', (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id)
    const userDetails = req.body
    
    User.update({_id: id}, userDetails, (err, raw) => {
        if(err) {
            res.send(500).send({status: 'error', error: err})
        }
        const {nModified: n} = raw
        res.send({status: (n > 0) ? `Updated ${n} docs successfully` : 'No Changes detected'})
    })
})

router.post('/', (req, res) => {
    if(req.role === 'agent' && req.body.role === 'admin') {
        res.status(403).send("Unauthorized")
    }
    else {
        const password = req.body.password ? req.body.password : ''
        let hashedPassword = bcrypt.hashSync(password, 8)
        User.create({
        name: req.body.name,
        email: req.body.email,
        mobileNo: req.body.mobileNo,
        password: hashedPassword,
        role: req.body.role,
        createdAt: new Date().toISOString()
        }, (err, user) => {
        if (err) {
            console.log(err)
            res.status(500).send("Registration failed")
        }
        else {
            var token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: 86400 })
            res.status(200).send({ auth: true, token: token })
        }
    
        })
    }
  })

module.exports = router