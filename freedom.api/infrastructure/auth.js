// Authentication Infrastructure
import moment from 'moment';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import passportJwt from 'passport-jwt';

import { config } from '../config';
import { userRepo } from '../repositories/user-repository';

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const jwtOptions = {
    issuer: 'Freedom',
    algorithms: ['HS512'],
    secretOrKey: config.apiSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const jwtSigningOptions = {
    // Must match the algorithms above!
    algorithm: 'HS512',
    // 5mins in seconds
    expiresIn: 300,
    issuer: jwtOptions.issuer
};

export const auth = {
    setupJwtAuthentication: () => {
        return (req, res, next) => {
            const app = req.app;
            app.use(passport.initialize());

            const strategy = new JwtStrategy(jwtOptions, (jwtPayload, next) => {
                //console.log("Jwt payload received.", jwtPayload);
                const email = jwtPayload.email.toLowerCase();
                userRepo.findByEmail(email).then(user => {
                    next(null, user);
                },
                msg => {
                    //console.log("Unauthorised request detected!");
                    next(null, false);
                });
            });
    
            passport.use(strategy);
            next();
        }
    },

    getJwt(user) {
        const payload = {
            sub: user.email,
            context: {
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            }
        };

        return new Promise((resolve, reject) => {
            jwt.sign(payload, jwtOptions.secretOrKey, jwtSigningOptions, (err, token) => {
                if (err) {
                    reject(err);
                    return;
                }

                const jwtToken = {
                    timeout: jwtSigningOptions.expiresIn,
                    expiresAt: moment().add(jwtSigningOptions.expiresIn, 's'),
                    jwt: token
                };

                resolve(jwtToken);
            });
        });
    }
}