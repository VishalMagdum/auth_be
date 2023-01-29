const bcrypt = require('bcryptjs');
const SALT = 10;
// for web token first install>> npm install jsonwebtoken
const jwt = require('jsonwebtoken')
const secret = 'bodjsldivjoyts)-I'


const HashPassword = async (password) => {
    let salt = await bcrypt.genSalt(SALT)
    // console.log(salt)
    let hash = await bcrypt.hash(password, salt)
    // console.log(hash)
    return hash
}
const hashCompare = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword)
}

//to create token 
const createToken = async (payload) => {
    let token = await jwt.sign(payload, secret, { expiresIn: '5m' })
    return token
}
const decodeToken = async (token) => {
    let data = await jwt.decode(token)
    return data
}
//validate is middleware to validate token
const validate = async (req, res, next) => {
    if (req.headers.authorization) {
        let token = req.headers.authorization.split(" ")[1]
        let data = await decodeToken(token)
        if (Math.round(Date.now() / 1000) <= data.exp) {
            next()
        }
        else {
            res.status(401).send({ message: "session Expired" })
        }
    }
    else {
        res.status(400).send({ message: "Token Not Found" })
    }

}
const roleAdmin = async (req, res, next) => {
    if (req.headers.authorization) {
        let token = req.headers.authorization.split(" ")[1]
        let data = await decodeToken(token)
        if (data.role === 'admin') {
            next()
        }
        else {
            res.status(401).send({ message: "Only Admin cab access" })
        }
    }
    else {
        res.status(400).send({ message: 'Token Not Found' })
    }

}
module.exports = { HashPassword, hashCompare, createToken, decodeToken, validate, roleAdmin }
// 01:03