import mongoose from 'mongoose';
import { config } from '../config';

export const db = {
    setupMongo: () => {
        // Set global mongoose promise to ES6 implementation of promise
        mongoose.Promise = Promise;

        const dbConnection = process.env.DB || config.database;
        mongoose.connect(config.database);
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        db.once('open', () => console.log("MongoDB connected!"));

        // Pass execution back to node middleware
        return (req, res, next) => next();
    }
};