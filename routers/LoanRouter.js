const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Loan = require('./../model/Loan')
const reqAuthorize = require('./../controller/requestAuthorizer')

router.get('/', (req, res) => {
    const status = req.query.status
    let createdOn = req.query.createdOn
    let updatedOn = req.query.updatedOn
    let query = {}
    if(req.role === 'customer')
        query.customerId = mongoose.Types.ObjectId(req.userId)
    if(status)
        query['details.status'] = status.toUpperCase()
    if(createdOn) {
        createdOn = createdOn.toUpperCase().replace(/'/g, '').replace(/"/g, '')
        if(!createdOn.includes('AND')) {
            query.createdOn = {
                $gte: new Date(createdOn.slice(6,10), parseInt(createdOn.slice(3,5))-1, createdOn.slice(0,2)),
                $lt: new Date(createdOn.slice(6,10), parseInt(createdOn.slice(3,5))-1, parseInt(createdOn.slice(0,2))+1)
            }
        }
        else {
            let [startDate, endDate] = createdOn.split('AND').map((date) => date.trim())
            query.createdOn = {
                $gte: new Date(startDate.slice(6,10), parseInt(startDate.slice(3,5))-1, startDate.slice(0,2)),
                $lte: new Date(endDate.slice(6,10), parseInt(endDate.slice(3,5))-1, parseInt(endDate.slice(0,2)))
            }
        }
    }
    if(updatedOn) {
        updatedOn = updatedOn.toUpperCase().replace(/'/g, '').replace(/"/g, '')
        if(!updatedOn.includes('AND')) {
            query.lastUpdatedOn = {
                $gte: new Date(updatedOn.slice(6,10), parseInt(updatedOn.slice(3,5))-1, updatedOn.slice(0,2)),
                $lt: new Date(updatedOn.slice(6,10), parseInt(updatedOn.slice(3,5))-1, parseInt(updatedOn.slice(0,2))+1)
            }
        }
        else {
            let [startDate, endDate] = updatedOn.split('AND').map((date) => date.trim())
            query.lastUpdatedOn = {
                $gte: new Date(startDate.slice(6,10), parseInt(startDate.slice(3,5))-1, startDate.slice(0,2)),
                $lte: new Date(endDate.slice(6,10), parseInt(endDate.slice(3,5))-1, parseInt(endDate.slice(0,2)))
            }
        }
    }
    Loan.find(query)
    .exec()
    .then(loans => {
        res.send(loans)
    })
    .catch(er => {
        res.status(500).json({
            error: er
        })
    })
})

router.post('/', reqAuthorize(['agent']), (req, res) => {
    const loanDetails = req.body
    loanDetails.createdOn = new Date().toISOString()
    loanDetails.createdBy = req.userId
    loanDetails.lastUpdatedBy = req.userId
    loanDetails.lastUpdatedOn = new Date().toISOString()
    loanDetails.customerId = mongoose.Types.ObjectId(loanDetails.customerId)
    const loan = new Loan(loanDetails)
    loan.save()
    .then(loan => {
        res.send({success: true, message: "Loan has been created successfully"})
    })
    .catch(er => {
        res.status(500).json({
            error: er
        })
    })
})

router.put('/:id', reqAuthorize(['agent']), (req, res) => {
    const loanDetails = req.body
    const id = mongoose.Types.ObjectId(req.params.id)
    Loan.findOne({_id: id})
    .exec()
    .then(loan => {
        const expectedStatus = 'APPROVED'
        if(loanDetails.status && loanDetails.status !== 'NEW') {
            res.status(403).send({message: `You are not authorized to update the status other than 'NEW'`})
        }
        else if(loan.details.status !== expectedStatus) {
            Loan.updateOne({_id: id}, {details: {...loan.details, ...loanDetails}, lastUpdatedBy: req.userId, lastUpdatedOn: new Date().toISOString()}, (err, raw) => {
                if(err) {
                    res.status(500).send({status: 'error', error: err})
                }
                const {nModified: n} = raw
                if(n > 0) {
                    Loan.updateOne({_id: id}, {$push: {history: {details: loan.details, updatedBy: loan.lastUpdatedBy, updatedOn: loan.lastUpdatedOn, __v: loan.history ? loan.history.length : 0}}}, (err, raw) => {
                        if(err) {
                            res.status(500).send({status: 'error', error: err})
                        }
                    })
                }
                res.send({status: (n > 0) ? `Updated ${n} docs successfully` : 'No Changes detected'})
            })
        }
        else {
            res.send({status: `Loan is already in ${expectedStatus} status`})
        }
    })
    .catch(er => {
        res.status(500).json({
            error: er
        })
    })    
})

router.put('/updateStatus/:id', reqAuthorize(['admin']), (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id)
    const status = req.body.status
    Loan.findOne({_id: id})
    .exec()
    .then(loan => {
        const loanDetailsBeforeUpdate = loan.details
        loan.details.status = status
        if(loan.history)
            loan.history.push({details: loanDetailsBeforeUpdate, updatedOn: loan.lastUpdatedOn, updatedBy: loan.lastUpdatedBy, __v: loan.history.length})
        else
            loan.history = [{details: loanDetailsBeforeUpdate, updatedOn: loan.lastUpdatedOn, updatedBy: loan.lastUpdatedBy, __v: 0}]
        loan.lastUpdatedOn = new Date().toISOString()
        loan.lastUpdatedBy = req.userId
        loan.save()
        .then(loan => {
            res.send({message: "Status has been updated"})
        })
        .catch(er => {
            res.status(500).json({
                error: er
            })
        })
    })
    .catch(er => {
        res.status(500).json({
            error: er
        })
    })
})

module.exports = router