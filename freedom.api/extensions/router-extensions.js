// Express Router Extensions
import express from 'express';
import passport from 'passport';

const jwtSettings = {
    session: false
};

class Api {
    constructor(router) {
        this.router = router;
    }

    setupRoutes() {
        return this.router;
    }

    get(route, authOptions, callback) {
        if (!authOptions) {
            this.router.get(route, (req, res, next) => callback(req, res, next));
            return;
        }

        this.router.get(route, 
            passport.authenticate('jwt', jwtSettings), 
            (req, res, next) => callback(req, res, next)
        );
    }

    post(route, authOptions, callback) {
        if (!authOptions) {
            this.router.post(route, (req, res, next) => callback(req, res, next));
            return;
        }

        this.router.post(route,
            passport.authenticate('jwt', jwtSettings),
            (req, res, next) => callback(req, res, next)
        );
    }

    put(route, authOptions, callback) {
        if (!authOptions) {
            this.router.put(route, (req, res, next) => callback(req, res, next));
            return;
        }

        this.router.put(route,
            passport.authenticate('jwt', jwtSettings),
            (req, res, next) => callback(req, res, next)
        );
    }
};

export const apiFactory = {
    create: () => {
        const router = express.Router();
        return new Api(router);
    }
};