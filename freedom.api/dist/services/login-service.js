'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../infrastructure/index');

var _userRepository = require('../repositories/user-repository');

var _userRepository2 = _interopRequireDefault(_userRepository);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Login Service
var assertLoginDto = function assertLoginDto(loginDto) {
    if (!loginDto.username) return { errorMessage: 'Username is required!' };
    if (!loginDto.password) return { errorMessage: 'Username is required!' };
    return { valid: true };
};

exports.default = {
    login: function login(loginDto) {
        return new Promise(function (resolve, reject) {
            // Assert
            var modelState = assertLoginDto(loginDto);
            if (modelState.errorMessage) {
                reject({ statusCode: 400, errorType: 'Validation', errorMessage: modelState.errorMessage });
                return;
            }

            // Find the user
            _userRepository2.default.findByEmail(loginDto.username).then(function (user) {
                // Check the password
                _index.crypto.comparePassword(loginDto.password, user.passwordHash).then(function (res) {
                    // User logged in successfully!
                    var token = _index.auth.getJwt(user);
                    resolve({
                        // Todo, add timeout to the token
                        jwt: token
                    });
                }, function (msg) {
                    return reject('User failed to login...');
                });
            }, function (msg) {
                console.log("Failed to login in: ", msg);
                reject({ statusCode: 401, errorType: 'Validation', errorMessage: 'User not found!' });
            }).catch(function (err) {
                console.error(err);
                reject({ statusCode: 500, errorType: 'Internal Server Error', errorMessage: 'An internal server error has occurred.' });
            });
        });
    }
};