import auth from '../routes/auth';
import test from '../routes/freedom';

export const routing = {
    configureRoutes: () => {
        return (req, res, next) => {
            const app = req.app;

            // API Version 1
            app.use('/api/v1/auth', auth.setupRoutes());
            app.use('/api/v1/freedom', test.setupRoutes());

            // Handle 404s
            app.use((req, res, next) => {
                res.status(404).send(null);
            });

            // Handle server errors
            app.use((err, req, res, next) => {
                console.error(err.stack);
                res.status(500).send(null);
            });

            next();
        };
    }
};