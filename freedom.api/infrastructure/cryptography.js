// Cryptography Infrastructure
import bcrypt from 'bcrypt';

export default {
    getPasswordSalt: function() {
        // Todo, add in infrastructure to periodically increase the salt rounds upwards
        // https://security.stackexchange.com/questions/17207/recommended-of-rounds-for-bcrypt
        const saltRounds = 16;
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(saltRounds).then(salt => {
                //console.log("Salt generated", salt);
                resolve(salt);
            }, msg => reject(msg))
            .catch(err => { throw new Error(err); });
        });
    },
    getPasswordHash: function(plainTextPassword, salt) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(plainTextPassword, salt).then(hash => {
                //console.log("Hash generated", hash);
                resolve(hash);
            }, msg => reject(msg))
            .catch(err => { throw new Error(err); });
        });
    },
    comparePassword: function(plainTextPassword, hashedPassword) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(plainTextPassword, hashedPassword).then(res => {
                if (res !== true) {
                    reject("Incorrect Password!");
                    return;
                }

                resolve("Password is correct!");
            }, msg => reject(msg))
            .catch(err => { throw new Error(err); })
        });
    }
};