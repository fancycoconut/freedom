// Api Client
import { config } from '../config';

class ApiClient {
    constructor() {
        this.api = config.api;
    }

    get(endpoint) {

    }

    post(endpoint, data) {
        const url = `${this.api}/api/v1/${endpoint}`;
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            mode: 'cors',
            cache: 'no-cache'
        });
    }
}

export default ApiClient;