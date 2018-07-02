import { apiFactory } from '../extensions/router-extensions';

const api = apiFactory.create();

// Example
api.get('/test', false, (req, res, next) => {
    res.status(200).send("Works!");
});
api.get('/secret', true, (req, res, next) => {
    res.status(200).send("Works!2");
});

export default api;