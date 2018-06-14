'use strict';

// Import dependencies required to set up http server
import express from 'express';


import config from './config';
import { db, auth, server, routing } from './infrastructure/index';

const app = express();

// Configure our web server
server.configureServices(app);
//app.use(express.static(path.join(__dirname, 'public')));

auth.useJwtAuthentication(app);

// Setup MongoDB
db.useMongo();

routing.configureRoutes(app);

app.listen(process.env.PORT || config.localhost_port, () => console.log('freedom is listening...'));
//app.listen(process.env.PORT || config.port, () => console.log('freedom is listening...'));