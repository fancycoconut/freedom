// Authentication Infrastructure
import jwt from 'jsonwebtoken';
import passport from 'passport';
import passportJwt from 'passport-jwt';

import config from '../config';
import userRepo from '../repositories/user-repository';

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

export default {
    useJwtAuthentication: function(app) {
        app.use(passport.initialize());

        const jwtOptions = {
            secretOrKey: config.apiSecret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        };

        const strategy = new JwtStrategy(jwtOptions, (jwtPayload, next) => {
            //console.log("Jwt payload received.", jwtPayload);
            userRepo.findByEmail(jwtPayload.email).then(user => {
                next(null, user);
            },
            msg => {
                //console.log("Unauthorised request detected!");
                next(null, false);
            });
        });

        passport.use(strategy);
    },

    getJwt(user) {
        const payload = {
            iss: 'Freedom',
            email: user.email,
            context: {
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            }
        };
        return jwt.sign(payload, config.apiSecret);
    }
}