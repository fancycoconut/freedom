'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _auth = require('../routes/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    configureRoutes: function configureRoutes(app) {
        // API Version 1
        app.use('/api/v1/auth', _auth2.default);

        // Handle 404s
        app.use(function (req, res, next) {
            res.status(404).send(null);
        });

        // Handle server errors
        app.use(function (err, req, res, next) {
            console.error(err.stack);
            res.status(500).send(null);
        });
    }
};