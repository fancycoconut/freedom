// User Repository
import User from '../models/user';

export default {
    findByEmail: function(userEmail) {
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

    addUser: function(user) {
        return new Promise((resolve, reject) => {
            user.save()
            .then(user => resolve(user), msg => reject(msg))
            .catch(err => reject(err));
        });
    }
};