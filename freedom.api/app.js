'use strict';

// Import dependencies required to set up http server
import express from 'express';

import { config } from './config';
import { db, auth, server, routing, crypto } from './infrastructure/index';

const app = express();

// Calculate bcrypt salt rounds
//crypto.calculateOptimalSaltRounds();

// Configure our web server
app.use(server.allowCrossDomain());
app.use(server.configureServices());
app.use(server.configureSecurity());
//app.use(express.static(path.join(__dirname, 'public')));

app.use(auth.setupJwtAuthentication());

// Setup MongoDB
app.use(db.setupMongo());
app.use(routing.configureRoutes());

app.listen(process.env.PORT || config.localhost_port, () => console.log('Freedom is listening...'));
//app.listen(process.env.PORT || config.port, () => console.log('Freedom is listening...'));