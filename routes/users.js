var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
const { dbUrl } = require('../dbConfig')
const { userModel } = require('../Schema/UserSchema')
const { HashPassword, hashCompare, createToken, decodeToken, validate, roleAdmin } = require('../common/auth')

mongoose.connect(dbUrl)
/* GET users listing. */
router.get('/all', validate, roleAdmin, async (req, res) => {
  try {

    let users = await userModel.find()
    res.status(200).send({ data: users })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
})
router.post('/signup', async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.email })
    if (!user) {
      // let hashedPassword = await HashPassword(req.body.password)
      req.body.password = await HashPassword(req.body.password)
      let user = await userModel.create(req.body)
      res.status(201).send({ message: "User Registration successfull" })
    }
    else {
      res.status(400).send({ message: `User with email ${req.body.email} already exist` })
    }

  } catch (error) {
    res.status(500).send({
      message: "Interbal Server Error", error
    })
  }
})


router.post('/login', async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.email })
    if (user) {
      if (await hashCompare(req.body.password, user.password)) {
        //need to create a token
        let token = await createToken({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          mobile: user.mobile,
          role: user.role
        })
        res.status(200).send({ message: "User Login successfull", token })
      }
      else {
        res.status(400).send({ message: "Invalid Password" })
      }
    }
    else {
      res.status(400).send({ message: `User with email ${req.body.email} does not exist` })
    }

  } catch (error) {
    res.status(500).send({
      message: "Interbal Server Error", error
    })
  }
})
module.exports = router;
