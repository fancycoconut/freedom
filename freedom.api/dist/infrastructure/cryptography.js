"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bcrypt = require("bcrypt");

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    getPasswordSalt: function getPasswordSalt() {
        // Todo, add in infrastructure to periodically increase the salt rounds upwards
        // https://security.stackexchange.com/questions/17207/recommended-of-rounds-for-bcrypt
        var saltRounds = 16;
        return new Promise(function (resolve, reject) {
            _bcrypt2.default.genSalt(saltRounds).then(function (salt) {
                //console.log("Salt generated", salt);
                resolve(salt);
            }, function (msg) {
                return reject(msg);
            }).catch(function (err) {
                throw new Error(err);
            });
        });
    },
    getPasswordHash: function getPasswordHash(plainTextPassword, salt) {
        return new Promise(function (resolve, reject) {
            _bcrypt2.default.hash(plainTextPassword, salt).then(function (hash) {
                //console.log("Hash generated", hash);
                resolve(hash);
            }, function (msg) {
                return reject(msg);
            }).catch(function (err) {
                throw new Error(err);
            });
        });
    },
    comparePassword: function comparePassword(plainTextPassword, hashedPassword) {
        return new Promise(function (resolve, reject) {
            _bcrypt2.default.compare(plainTextPassword, hashedPassword).then(function (res) {
                if (res !== true) {
                    reject("Incorrect Password!");
                    return;
                }

                resolve("Password is correct!");
            }, function (msg) {
                return reject(msg);
            }).catch(function (err) {
                throw new Error(err);
            });
        });
    }
}; // Cryptography Infrastructure