// Authentication Controller
import { apiFactory } from '../extensions/router-extensions';
import { loginService, registrationService } from '../services/index';

const api = apiFactory.create();

api.post('/login', false, function(req, res, next) {
    const loginDto = {
        username: req.body.username,
        password: req.body.password
    };

    loginService.login(loginDto)
        .then(jwt => res.status(200).json(jwt),
            // Do not give consumer or client detailed information to crack passwords
            err => {
                //console.error(err);
                if (err.statusCode === 401) {
                    res.status(401).json({ errorType: err.errorType, errorMessage: err.errorMessage});
                }
                else {
                    res.status(401).json({ errorType: 'Unauthorized', errorMessage: 'Invalid username or password!'});
                }                
            });
});

api.post('/register', false, function(req, res, next) {
    const newUserDto = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    };

    registrationService.registerNewUser(newUserDto)
        .then(result => res.status(201).send(null),
        err => {
            //console.error(err);
            res.status(err.statusCode).json({ errorType: err.errorType, errorMessage: err.errorMessage})
        });
});


// Example
api.get('/secret', true, (req, res, next) => {
    res.status(200).send("Secret!");
});

export default api;