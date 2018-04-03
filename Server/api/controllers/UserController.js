/* eslint-disable max-len */
/* eslint-disable max-statements */

// ---------------------- Requirements ---------------------- //
var mongoose = require('mongoose');
var Encryption = require('../utils/encryption/encryption');
var LocalStrategy = require('passport-local').Strategy;
var User = mongoose.model('User');

var newUser = new User();
// ---------------------- End of "Requirements" ---------------------- //


// ---------------------- Validators ---------------------- //
var isArray = require('../utils/validators/is-array');
var isBoolean = require('../utils/validators/is-boolean');
var isDate = require('../utils/validators/is-date');
var isInteger = require('../utils/validators/is-integer');
var isString = require('../utils/validators/is-string');
var isNotEmpty = require('../utils/validators/not-empty');
// ---------------------- End of "Validators" ---------------------- //


module.exports.signUp = function (req, res, next) {
    if (req.res) {
        delete req.user.password;

        return res.status(req.res.code).json({
            data: req.user,
            err: null,
            msg: req.res.msg
        });
    }

    return next();
};

module.exports.signIn = function (req, res, next) {
    if (req.user) {
        delete req.user.password;

        return res.status(200).json({
            data: req.user,
            err: null,
            msg: 'Sign In Successfully!'
        });
    }

    return res.status(400).json({
        data: req.user,
        err: null,
        msg: 'Wrong Username Or Password!'
    });
};


module.exports.signUpChild = function (req, res, next) {
    // to make the user a parent
    console.log('entered the signUpChild method');
    console.log('user is: ' + req.user._id);
    User.findByIdAndUpdate(req.user._id, { $set: { 'isParent': true } && { 'children': req.body.username } }, { new: true }, function(err, updatedob) {
                if (err) { 
                    return res.status(402).json({
                    data: null, 
                    msg: 'error occurred during updating parents attributes , parent is:' + req.user._id.isParent
                    });
                }
                return res.status(200).json({
                data: updatedob,
                err: null,
                msg: 'update is successful'
             });
         });
     //   User.findByIdAndUpdate(req.user._id, { $set: { isParent: true } });

   // var userid = req.params.userID;
    // User.findByIdAndUpdate(id, $set, { isParent: true });
    //end if

    // --- Variable Assign --- //
    newUser.address = req.body.address;
    newUser.birthdate = req.body.birthdate;
    newUser.children = [];
    newUser.email = req.body.email;
    newUser.firstName = req.body.firstName;
    newUser.isChild = true;
    newUser.isParent = false;
    newUser.isTeacher = false;
    newUser.lastName = req.body.lastName;
    newUser.password = req.body.password;
    newUser.phone = req.body.phone;
    newUser.username = req.body.username;
    // --- End of "Variable Assign" --- //


    try {
        isString(newUser.address ? newUser.address : '');
        isDate(newUser.birthdate ? newUser.birthdate : new Date());
        isArray(newUser.children ? newUser.children : []);
        isString(newUser.email ? newUser.email : '');
        isString(newUser.firstName ? newUser.firstName : '');
        isBoolean(newUser.isChild ? newUser.isChild : false);
        isBoolean(newUser.isParent ? newUser.isParent : false);
        isBoolean(newUser.isTeacher ? newUser.isTeacher : false);
        isString(newUser.lastName ? newUser.lastName : '');
        isString(newUser.password ? newUser.password : '');
        isArray(newUser.phone ? newUser.phone : []);
        isString(newUser.username ? newUser.username : '');

    } catch (err) {
        return res.status(401).json({
            data: null,
            err: null,
            msg: 'your message does not match the required data entries!' + err.message
        });
    }
    //end catch

    try {
        isNotEmpty(newUser.birthdate);
        isNotEmpty(newUser.email);
        isNotEmpty(newUser.firstName);
        isNotEmpty(newUser.isChild);
        isNotEmpty(newUser.isParent);
        isNotEmpty(newUser.isTeacher);
        isNotEmpty(newUser.lastName);
        isNotEmpty(newUser.password);
        isNotEmpty(newUser.username);
    } catch (err) {
        return res.status(401).json({
            data: null,
            err: null,
            msg: 'you are missing a required data entry!' + err.message
        });
    }
    //end catch


    newUser.save(function (err) {
        if (err) {
            throw err;
        }

        return res.status(201).json({
            data: newUser,
            err: null,
            msg: 'Success!'
        });
    });
};
