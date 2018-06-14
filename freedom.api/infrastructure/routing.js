import auth from '../routes/auth';

export default {
    configureRoutes: function(app) {
        // API Version 1
        app.use('/api/v1/auth', auth);

        // Handle 404s
        app.use(function (req, res, next) {
            res.status(404).send(null);
        });

        // Handle server errors
        app.use(function (err, req, res, next) {
            console.error(err.stack);
            res.status(500).send(null);
        });
    }
};