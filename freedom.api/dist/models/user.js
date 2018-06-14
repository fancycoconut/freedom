'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var UserSchema = new Schema({
    firstName: { type: String, required: true, maxlength: 100 },
    lastName: { type: String, required: true, maxlength: 100 },
    email: { type: String, index: true, unique: true, required: true, maxlength: 255 },
    dateOfBirth: { type: Date, required: false },

    salt: { type: String, required: true },
    passwordHash: { type: String, required: true }
});

exports.default = _mongoose2.default.model('User', UserSchema);