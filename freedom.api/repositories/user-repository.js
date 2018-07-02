// User Repository
import { User } from '../models/user';

export const userRepo = {
    findByEmail: userEmail => {
        return new Promise((resolve, reject) => {
            const query = User.findOne({
                email: userEmail
            });
            query.exec()
            .then(user => {
                if (!user) {
                    reject("User not found!");
                    return;
                }

                resolve(user);
            }, msg => reject(msg))
            .catch(err => reject(err));
        });        
    },

    add: user => {
        return new Promise((resolve, reject) => {
            user.save()
            .then(user => resolve(user), msg => reject(msg))
            .catch(err => reject(err));
        });
    },

    update: user => {
        return new Promise((resolve, reject) => {
            user.save().then(user => {
                resolve("User has been updated!");
            }, msg => reject(msg));
        });        
    },

    delete: user => {
        return new Promise((resolve, reject) => {
            user.deleted = true;
            user.save().then(user => {
                resolve("User has been deleted!");
            }, msg => reject(msg));
        });
    }
};