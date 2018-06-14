"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _user = require("../models/user");

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    findByEmail: function findByEmail(userEmail) {
        return new Promise(function (resolve, reject) {
            var query = _user2.default.findOne({
                email: userEmail
            });
            query.exec().then(function (user) {
                if (!user) {
                    reject("User not found!");
                    return;
                }

                resolve(user);
            }, function (msg) {
                return reject(msg);
            }).catch(function (err) {
                return reject(err);
            });
        });
    },

    addUser: function addUser(user) {
        return new Promise(function (resolve, reject) {
            user.save().then(function (user) {
                return resolve(user);
            }, function (msg) {
                return reject(msg);
            }).catch(function (err) {
                return reject(err);
            });
        });
    }
}; // User Repository