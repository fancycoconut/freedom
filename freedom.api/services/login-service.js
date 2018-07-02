// Login Service
import { auth, crypto } from '../infrastructure/index';
import { userRepo } from '../repositories/user-repository';

const MAX_LOGIN_ATTEMPTS = 5;

export class UserLoginService {
    constructor(userRepo, cryptoService, authService) {
        this.userRepo = userRepo;
        this.cryptoService = cryptoService;
        this.authService = authService;
    }

    login(loginDto) {
        const self = this;
        return new Promise((resolve, reject) => {
            // Assert
            const modelState = self._assert(loginDto);
            if (modelState.errorMessage) {
                reject({ statusCode: 400, errorType: 'Validation', errorMessage: modelState.errorMessage });
                return;
            }

            // Find the user
            const email = loginDto.username.toLowerCase();
            self.userRepo.findByEmail(email).then(user => {
                if (self._isAccountLocked(user)) {                  
                    reject({ statusCode: 401, errorType: 'Unauthorized', errorMessage: 'You have exceeded the number of allowable login attempts, as a result, your account has been locked.' });
                    return;
                }

                // Check the password
                self.cryptoService.comparePassword(loginDto.password, user.passwordHash).then(res => {
                    // User logged in successfully!
                    self.authService.getJwt(user).then(token => {
                            resolve(token);
                        },
                        msg => reject('Failed to sign jwt'));                    
                },
                msg => {
                    self._incrementLoginAttempt(user);
                    reject('User failed to login...');
                });
            },
            msg => {
                //console.log("Failed to login in: ", msg);
                reject('User not found!');
            })
            .catch(err => {
                console.error(err);
                reject({ statusCode: 500, errorType: 'Internal Server Error', errorMessage: 'An internal server error has occurred.' });
            });
        });
    }

    _assert(loginDto) {
        if (!loginDto.username) return { errorMessage: 'Username is required!' };
        if (!loginDto.password) return { errorMessage: 'Username is required!' };
        return { valid: true };
    }

    _isAccountLocked(user) {
        return user.loginAttempts > MAX_LOGIN_ATTEMPTS;        
    }

    _incrementLoginAttempt(user) {
        const currentLoginAttempts = user.loginAttempts + 1;
        if (currentLoginAttempts > MAX_LOGIN_ATTEMPTS) return;
        user.loginAttempts = currentLoginAttempts;
        user.lastFailedLoginAttemptTime = new Date();
        this.userRepo.update(user);
    }
};

export const loginService = new UserLoginService(userRepo, crypto, auth);
