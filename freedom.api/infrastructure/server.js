// Server Setup
import logger from 'morgan';
import helmet from 'helmet';
import bodyParser from 'body-parser';
//import expressSanitized from 'express-sanitized'


export const server = {
    configureServices: () => {
        return (req, res, next) => {
            const app = req.app;

            app.use(logger('dev'));
            app.use(bodyParser.json());
            //app.use(expressSanitized());
            next();
        }
    },
    configureSecurity: () => {
        return (req, res, next) => {
            const app = req.app;
            app.use(helmet());
            next();
        }
    },
    allowCrossDomain: () => {
        return (req, res, next) => {
            res.header('Access-Control-Allow-Credentials', true);
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'x-access-token, Content-Type, Authorization, Content-Length, X-Requested-With');
            // intercept OPTIONS method
            if ('OPTIONS' == req.method) {
                res.sendStatus(200);
            }
            else {
                next();
            }
        }
    }
};