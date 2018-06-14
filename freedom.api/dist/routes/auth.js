'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _loginService = require('../services/login-service');

var _loginService2 = _interopRequireDefault(_loginService);

var _registrationService = require('../services/registration-service');

var _registrationService2 = _interopRequireDefault(_registrationService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Authentication Controller
var router = _express2.default.Router();

router.post('/login', function (req, res, next) {
    var loginDto = {
        username: req.body.username,
        password: req.body.password
    };

    _loginService2.default.login(loginDto).then(function (jwt) {
        return res.status(200).json(jwt);
    },
    // Do not give consumer or client detailed information to crack passwords
    function (err) {
        return res.status(401).json({ errorType: 'Login Failed', errorMessage: 'Invalid username or password!' });
    });
});

router.post('/register', function (req, res, next) {
    var newUserDto = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    };

    _registrationService2.default.registerNewUser(newUserDto).then(function (result) {
        return res.status(201).send(null);
    }, function (err) {
        return res.status(err.statusCode).json({ errorType: err.errorType, errorMessage: err.errorMessage });
    });
});

router.get('/secret', _passport2.default.authenticate('jwt', { session: false }), function (req, res, next) {
    res.status(200).send("Secret!");
});

exports.default = router;