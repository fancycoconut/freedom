'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Server Setup
exports.default = {
    configureServices: function configureServices(app) {
        app.use((0, _morgan2.default)('dev'));
        // app.use(bodyParser.urlencoded({
        //     extended: true
        // }));
        app.use(_bodyParser2.default.json());
        //app.use(expressSanitized());
    }
};