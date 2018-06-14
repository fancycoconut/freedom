import mongoose from 'mongoose';
import config from '../config';

export default {
    // Setup MongoDB
    useMongo: function() {
        // Set global mongoose promise to ES6 implementation of promise
        mongoose.Promise = Promise;
        mongoose.connect(config.database);
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        db.once('open', () => console.log("MongoDB connected!"));
    }
};