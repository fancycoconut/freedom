// Cryptography Infrastructure
import bcrypt from 'bcrypt';

export const crypto = {
    getPasswordSalt: () => {
        const saltRounds = 15;
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(saltRounds).then(salt => {
                //console.log("Salt generated", salt);
                resolve(salt);
            }, msg => reject(msg))
            .catch(err => { throw new Error(err); });
        });
    },

    getPasswordHash: (plainTextPassword, salt) => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(plainTextPassword, salt).then(hash => {
                //console.log("Hash generated", hash);
                resolve(hash);
            }, msg => reject(msg))
            .catch(err => { throw new Error(err); });
        });
    },

    comparePassword: (plainTextPassword, hashedPassword) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(plainTextPassword, hashedPassword).then(res => {
                if (res !== true) {
                    reject("Incorrect Password!");
                    return;
                }

                resolve("Password is correct!");
            }, msg => reject(msg))
            .catch(err => { throw new Error(err); });
        });
    },

    // Todo, add in infrastructure to periodically increase the salt rounds upwards
    // https://security.stackexchange.com/questions/17207/recommended-of-rounds-for-bcrypt
    calculateOptimalSaltRounds: () => {
        const defaultRounds = 15;
        let saltRounds = defaultRounds;

        console.log('Calculating optimal salt rounds for bcrypt...');
        let duration = 0;
        while (duration < 4) {            
            const startTime = new Date();
            const hash = bcrypt.hashSync('B3nchmarkTest', saltRounds);            
            const endTime = new Date();
            duration = (endTime - startTime) / 1000;
            console.log("Hash: ", hash, " at ", duration, " seconds, at ", saltRounds, " rounds");

            saltRounds++;            
        }
        
        console.log('Optimal salt rounds for bcrypt: ', saltRounds - 1);
        return saltRounds;
    }
};