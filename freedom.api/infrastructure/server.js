// Server Setup
import logger from 'morgan';
import bodyParser from 'body-parser';


export default {
    configureServices: function(app) {
        app.use(logger('dev'));
        // app.use(bodyParser.urlencoded({
        //     extended: true
        // }));
        app.use(bodyParser.json());
        //app.use(expressSanitized());
    }
};