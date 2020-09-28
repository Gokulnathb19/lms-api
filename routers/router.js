const express = require('express')
const router = express.Router()
const authRouter = require('./AuthRouter')
const fileRouter = require('./fileRouter')
const userRouter = require('./userRouter')
const LoanRouter = require('./LoanRouter')
const reqAuthorize = require('./../controller/requestAuthorizer')
const reqAuthenticate = require('./../controller/requestAuthenticator')


router.use(authRouter)
router.use(fileRouter)
router.use('/users',reqAuthenticate, reqAuthorize(['agent', 'admin']), userRouter)
router.use('/loans',reqAuthenticate, LoanRouter)

module.exports = router