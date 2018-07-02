// Login Api Client
import ApiClient from './api-client';

class LoginApi extends ApiClient {
    constructor() {
        super();
    }

    login(username, password) {
        const client = this;
        return new Promise((resolve, reject) => {
            client.post('auth/login', {
                username: username,
                password: password
            })
            .then(res => {
                const data = res.json();
                if (res.status !== 200) {
                    data.then(err => reject(err));
                    return;
                }

                data.then(jwt => resolve(jwt));
            })
            .catch(err => {
                console.error(err);
                reject('An error has occurred while trying to log you in. Please try again later...');
            });
        });
    }
}

export default LoginApi;