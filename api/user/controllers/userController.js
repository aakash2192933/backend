const { t } = require('typy');
const jwt = require("jsonwebtoken");

const { saveUser, updateUser } = require('../services/userServices');
const { success, error, validationError } = require('../../../helpers/responses');

const User = require('../../../models/user');

// authenticating even if user dosent exist in db as it is mock auth
exports.authenticate = async (req, res) => {
    // validation
    const validationObj = {};
    validationObj.username = t(req.body, 'username').isString ? t(req.body, 'username').safeString : undefined;
    validationObj.password = t(req.body, 'password').isString ? t(req.body, 'password').safeString : undefined;

    const validationArray = [];
    const validationKeys = Object.keys(validationObj);
    validationKeys.forEach((key) => {
        if (!validationObj[key]) {
            validationArray.push(`${key} is missing or is invalid.`);
        }
    });

    if (validationArray.length) {
      res.status(403).json(validationError(validationArray));
      return;
    }

    // check if user already exists - sign in
    const user = await User.findOne({username: validationObj.username});

    if(user) {
        // not encrypting password yet
        if(user.password === validationObj.password){
            const payload = {
                user: {
                    id: user._id
                }
            };
    
            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) return res.status(403).json(error('Error signing jwt!', 403));
                    return res.status(200).json(success('User signed in!!!', {token: token}, 200));
                }
            );
        } else {
            return res.status(400).json(error('Invalid password!', 400));
        }
    }

    // save user in db if user dosent exist
    saveUser(
        validationObj.username,
        validationObj.password
    ).then(response => {
        // sign jwt and send it in response
        const payload = {
            user: {
                id: response._id
            }
        };

        jwt.sign(
            payload,
            "randomString", {
                expiresIn: 10000
            },
            (err, token) => {
                if (err) res.status(403).json(error('Error signing jwt!', 403));
                res.status(200).json(success('User signed up!!!', {token: token}, 200));
            }
        );
    }).catch(err => {
        res.status(403).json(error('Error creating user entry!', 403));
    });
}

// validate token and return user
exports.validateToken = async (req, res) => {
    const token = t(req.headers, 'token').safeString;
    if (!token) return res.status(403).json(error('Token not sent !!!', 403));

    try {
      const decoded = jwt.verify(token, "randomString");

      console.log(decoded.user);
      const user = await User.findOne({_id: decoded.user.id});
      if(user) {
        res.status(200).json(success('Verified !!!', {username: user.username, _id: user._id}, 200));
      } else {
        res.status(500).send({ message: "Invalid Token !!!" });     
      }
    } catch (e) {
        res.status(500).json(error('Invalid Token !!!', 500));
    }
}

// add Address
exports.addAddress = async (req, res) => {
    const token = t(req.headers, 'token').safeString;
    if (!token) return res.status(403).json(error('Token not sent !!!', 403));

    const address = t(req.body, 'address').safeString;
    if(!address) return res.status(403).json(error('Address not sent !!!', 403));

    try{
        const decoded = jwt.verify(token, "randomString");

        updateUser(address, decoded.user.id)
            .then(doc => {
                res.status(200).json(success('Address updated !!!', {address: address}, 200));
            })
            .catch(err => {
                res.status(403).json(error('Could not update address !!!', 403));
            })
    } catch (e) {
        res.status(500).json(error('Invalid Token !!!', 500));
    }
}