// Login Service
import { auth, crypto } from '../infrastructure/index';
import userRepo from '../repositories/user-repository';

const assertLoginDto = function(loginDto) {
    if (!loginDto.username) return { errorMessage: 'Username is required!' };
    if (!loginDto.password) return { errorMessage: 'Username is required!' };
    return { valid: true };
}

export default {
    login: function(loginDto) {
        return new Promise((resolve, reject) => {
            // Assert
            const modelState = assertLoginDto(loginDto);
            if (modelState.errorMessage) {
                reject({ statusCode: 400, errorType: 'Validation', errorMessage: modelState.errorMessage });
                return;
            }

            // Find the user
            userRepo.findByEmail(loginDto.username).then(user => {
                // Check the password
                crypto.comparePassword(loginDto.password, user.passwordHash).then(res => {
                    // User logged in successfully!
                    const token = auth.getJwt(user);
                    resolve({
                        // Todo, add timeout to the token
                        jwt: token
                    });
                },
                msg => reject('User failed to login...'));
            },
            msg => {
                console.log("Failed to login in: ", msg);
                reject({ statusCode: 401, errorType: 'Validation', errorMessage: 'User not found!' });
            })
            .catch(err => {
                console.error(err);
                reject({ statusCode: 500, errorType: 'Internal Server Error', errorMessage: 'An internal server error has occurred.' });
            });
        });
    }
};