// Registration Service
import User from '../models/user';
import crypto from '../infrastructure/cryptography';
import userRepo from '../repositories/user-repository';
import validationHelper from '../helpers/validationHelpers';

const assertNewUser = function(userDto) {
    if (!userDto.firstName) return { errorMessage: 'First Name is required.'};
    if (!userDto.lastName) return { errorMessage: 'Last Name is required.'};
    if (!userDto.email) return { errorMessage: 'Email is required.'};
    if (!userDto.password) return { errorMessage: 'Password is required.'};
    if (!userDto.confirmPassword) return { errorMessage: 'ConfirmPassword is required.'};
    return { valid: true };
};

const validateNewUser = function(userDto) {
    if (userDto.email.length < 3) return { errorMessage: 'Email length is invalid.'};
    if (!validationHelper.validateEmail(userDto.email)) return { errorMessage: 'Email is invalid.'};
    if (userDto.password !== userDto.confirmPassword) return { errorMessage: 'Entered passwords do not match.'};
    return { valid: true };
};

export default {
    registerNewUser: function(userDto) {
        return new Promise((resolve, reject) => {
            // Assert
            const assertionState = assertNewUser(userDto);
            if (assertionState.errorMessage) {
                reject({ statusCode: 400, errorType: 'Validation', errorMessage: assertionState.errorMessage });
                return;
            }

            // Validate
            const validationState = validateNewUser(userDto);
            if (validationState.errorMessage) {
                reject({ statusCode: 400, errorType: 'Validation', errorMessage: validationState.errorMessage });
                return;
            }

            // Check if the user already exists
            userRepo.findByEmail(userDto.email).then(user => {
                reject({ statusCode: 400, errorType: 'Bad Request', errorMessage: 'User already exists!' });
            }, 
            msg => {
                // Generate password salt
                crypto.getPasswordSalt().then(salt => {
                    // Generate password hash
                    crypto.getPasswordHash(userDto.password, salt).then(hash => {
                        const newUser = new User({
                            firstName: userDto.firstName,
                            lastName: userDto.lastName,
                            email: userDto.email,
                            salt: salt,
                            passwordHash: hash
                        });

                        // Add the user to the database
                        userRepo.addUser(newUser).then(
                            user => resolve("User created successfully!"),
                            failedToCreateUserMsg => { throw new Error(failedToCreateUserMsg); }
                        );
                    },
                    failedToGetHashMsg => {
                        throw new Error(failedToGetHashMsg);
                    });                    
                }, failedToGenerageSaltMsg => {
                    throw new Error(failedToGenerageSaltMsg);
                });
            })
            .catch(err => {
                console.error(err);
                reject({ statusCode: 500, errorType: 'Internal Server Error', errorMessage: 'An internal server error has occurred.' });
            });
        });
    }
};