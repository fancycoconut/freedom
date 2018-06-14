'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _cryptography = require('../infrastructure/cryptography');

var _cryptography2 = _interopRequireDefault(_cryptography);

var _userRepository = require('../repositories/user-repository');

var _userRepository2 = _interopRequireDefault(_userRepository);

var _validationHelpers = require('../helpers/validationHelpers');

var _validationHelpers2 = _interopRequireDefault(_validationHelpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Registration Service
var assertNewUser = function assertNewUser(userDto) {
    if (!userDto.firstName) return { errorMessage: 'First Name is required.' };
    if (!userDto.lastName) return { errorMessage: 'Last Name is required.' };
    if (!userDto.email) return { errorMessage: 'Email is required.' };
    if (!userDto.password) return { errorMessage: 'Password is required.' };
    if (!userDto.confirmPassword) return { errorMessage: 'ConfirmPassword is required.' };
    return { valid: true };
};

var validateNewUser = function validateNewUser(userDto) {
    if (userDto.email.length < 3) return { errorMessage: 'Email length is invalid.' };
    if (!_validationHelpers2.default.validateEmail(userDto.email)) return { errorMessage: 'Email is invalid.' };
    if (userDto.password !== userDto.confirmPassword) return { errorMessage: 'Entered passwords do not match.' };
    return { valid: true };
};

exports.default = {
    registerNewUser: function registerNewUser(userDto) {
        return new Promise(function (resolve, reject) {
            // Assert
            var assertionState = assertNewUser(userDto);
            if (assertionState.errorMessage) {
                reject({ statusCode: 400, errorType: 'Validation', errorMessage: assertionState.errorMessage });
                return;
            }

            // Validate
            var validationState = validateNewUser(userDto);
            if (validationState.errorMessage) {
                reject({ statusCode: 400, errorType: 'Validation', errorMessage: validationState.errorMessage });
                return;
            }

            // Check if the user already exists
            _userRepository2.default.findByEmail(userDto.email).then(function (user) {
                reject({ statusCode: 400, errorType: 'Bad Request', errorMessage: 'User already exists!' });
            }, function (msg) {
                // Generate password salt
                _cryptography2.default.getPasswordSalt().then(function (salt) {
                    // Generate password hash
                    _cryptography2.default.getPasswordHash(userDto.password, salt).then(function (hash) {
                        var newUser = new _user2.default({
                            firstName: userDto.firstName,
                            lastName: userDto.lastName,
                            email: userDto.email,
                            salt: salt,
                            passwordHash: hash
                        });

                        // Add the user to the database
                        _userRepository2.default.addUser(newUser).then(function (user) {
                            return resolve("User created successfully!");
                        }, function (failedToCreateUserMsg) {
                            throw new Error(failedToCreateUserMsg);
                        });
                    }, function (failedToGetHashMsg) {
                        throw new Error(failedToGetHashMsg);
                    });
                }, function (failedToGenerageSaltMsg) {
                    throw new Error(failedToGenerageSaltMsg);
                });
            }).catch(function (err) {
                console.error(err);
                reject({ statusCode: 500, errorType: 'Internal Server Error', errorMessage: 'An internal server error has occurred.' });
            });
        });
    }
};