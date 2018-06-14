'use strict';

// Import dependencies required to set up http server

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _index = require('./infrastructure/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

// Configure our web server
_index.server.configureServices(app);
//app.use(express.static(path.join(__dirname, 'public')));

_index.auth.useJwtAuthentication(app);

// Setup MongoDB
_index.db.useMongo();

_index.routing.configureRoutes(app);

app.listen(process.env.PORT || _config2.default.localhost_port, function () {
  return console.log('freedom is listening...');
});
//app.listen(process.env.PORT || config.port, () => console.log('freedom is listening...'));