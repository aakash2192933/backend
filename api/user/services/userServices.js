const User = require('../../../models/user');

/**
 * @description Create a user record
 *
 * @param { String } username
 * @param { String } password
 * 
 * @returns object
 */

exports.saveUser = (username, password) => new Promise((resolve, reject) => {
    const user = new User({
        username,
        password,
    });

    user.save().then(doc => {
        resolve(doc);
    }).catch(error => {
        reject(error);
    })
});

/**
 * @description Update user address
 *
 * @param { String } address
 * @param { String } userId
 * 
 * @returns object
 */

exports.updateUser = (address, userId) => new Promise((resolve, reject) => {
    User.findByIdAndUpdate(userId, {
      address: address,
      updated_at: Date.now(),
    }, { new: false }).then((doc) => {
      resolve(doc);
    }).catch((err) => reject(err));
});