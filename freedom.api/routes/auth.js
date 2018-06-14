// Authentication Controller
import passport from 'passport';
import express from 'express';
import loginService from '../services/login-service';
import registrationService from '../services/registration-service';

const router = express.Router();

router.post('/login', function(req, res, next) {
    const loginDto = {
        username: req.body.username,
        password: req.body.password
    };

    loginService.login(loginDto)
        .then(jwt => res.status(200).json(jwt),
            // Do not give consumer or client detailed information to crack passwords
            err => res.status(401).json({ errorType: 'Login Failed', errorMessage: 'Invalid username or password!'})
        );
});

router.post('/register', function(req, res, next) {
    const newUserDto = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    };

    registrationService.registerNewUser(newUserDto)
        .then(result => res.status(201).send(null),
        err => res.status(err.statusCode).json({ errorType: err.errorType, errorMessage: err.errorMessage})
    );
});

// Example
router.get('/secret', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.status(200).send("Secret!");
});

export default router;