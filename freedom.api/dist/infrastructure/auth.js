'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportJwt = require('passport-jwt');

var _passportJwt2 = _interopRequireDefault(_passportJwt);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _userRepository = require('../repositories/user-repository');

var _userRepository2 = _interopRequireDefault(_userRepository);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var JwtStrategy = _passportJwt2.default.Strategy; // Authentication Infrastructure

var ExtractJwt = _passportJwt2.default.ExtractJwt;

exports.default = {
    useJwtAuthentication: function useJwtAuthentication(app) {
        app.use(_passport2.default.initialize());

        var jwtOptions = {
            secretOrKey: _config2.default.apiSecret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        };

        var strategy = new JwtStrategy(jwtOptions, function (jwtPayload, next) {
            console.log("Jwt payload received.", jwtPayload);
            _userRepository2.default.findByEmail(jwtPayload.email).then(function (user) {
                next(null, user);
            }, function (msg) {
                console.log("Unauthorised request detected!");
                next(null, false);
            });
        });

        _passport2.default.use(strategy);
    },

    getJwt: function getJwt(user) {
        var payload = {
            iss: 'Freedom',
            email: user.email,
            context: {
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            }
        };
        return _jsonwebtoken2.default.sign(payload, _config2.default.apiSecret);
    }
};