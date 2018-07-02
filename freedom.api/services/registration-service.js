// Registration Service
import { User } from '../models/user';
import { crypto } from '../infrastructure/cryptography';
import { userRepo } from '../repositories/user-repository';
import { validationHelper } from '../helpers/validationHelpers';

export class UserRegistrationService {
    constructor(userRepo, validationHelper, cryptoService) {
        this.userRepo = userRepo;
        this.cryptoService = cryptoService;
        this.validationHelper = validationHelper;
    }

    registerNewUser(userDto) {
        const self = this;
        return new Promise((resolve, reject) => {
            // Assert
            const modelState = self._assert(userDto);
            if (modelState.errorMessage) {
                reject({ statusCode: 400, errorType: 'Validation', errorMessage: modelState.errorMessage });
                return;
            }

            // Validate
            const validationState = self._validate(userDto);
            if (validationState.errorMessage) {
                reject({ statusCode: 400, errorType: 'Validation', errorMessage: validationState.errorMessage });
                return;
            }

            // Check if the user already exists
            self.userRepo.findByEmail(userDto.email).then(user => {
                reject({ statusCode: 400, errorType: 'Bad Request', errorMessage: 'User already exists!' });
            }, 
            msg => {
                // Generate password salt
                self.cryptoService.getPasswordSalt().then(salt => {
                    // Generate password hash
                    self.cryptoService.getPasswordHash(userDto.password, salt).then(hash => {
                        const newUser = new User({
                            firstName: userDto.firstName,
                            lastName: userDto.lastName,
                            email: userDto.email.toLowerCase(),
                            salt: salt,
                            passwordHash: hash
                        });

                        // Add the user to the database
                        self.userRepo.add(newUser).then(
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

    _assert(userDto) {
        if (!userDto.firstName) return { errorMessage: 'First Name is required.'};
        if (!userDto.lastName) return { errorMessage: 'Last Name is required.'};
        if (!userDto.email) return { errorMessage: 'Email is required.'};
        if (!userDto.password) return { errorMessage: 'Password is required.'};
        if (!userDto.confirmPassword) return { errorMessage: 'ConfirmPassword is required.'};
        return { valid: true };
    }

    _validate(userDto) {
        if (userDto.email.length < 3) return { errorMessage: 'Email length is invalid.'};        
        if (userDto.password !== userDto.confirmPassword) return { errorMessage: 'Entered passwords do not match.'};
        if (!this.validationHelper.validateEmail(userDto.email)) return { errorMessage: 'Email is invalid.'};
        if (!this.validationHelper.validatePassword(userDto.password)) return { errorMessage: 'You have entered an invalid password. A valid password must have at least 1 uppercase character, 1 lowercase character, 1 number or special character and be at least 8 characters in length.' }
        return { valid: true };
    }
};

export const registrationService = new UserRegistrationService(userRepo, validationHelper, crypto);

