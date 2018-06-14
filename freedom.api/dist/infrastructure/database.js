'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    // Setup MongoDB
    useMongo: function useMongo() {
        // Set global mongoose promise to ES6 implementation of promise
        _mongoose2.default.Promise = Promise;
        _mongoose2.default.connect(_config2.default.database);
        var db = _mongoose2.default.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        db.once('open', function () {
            return console.log("MongoDB connected!");
        });
    }
};