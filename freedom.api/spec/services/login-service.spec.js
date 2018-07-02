// Login Service Tests
import { UserLoginService } from '../../services/index';

describe("Login Service Tests:", () => {
    let loginService = null;
    const mockAuthService = {
        getJwt: user => "jwt.object"
    };
    const mockCryptoService = {
        comparePassword: (plaintextPassword, hash) => { return Promise.resolve(true); }
    };
    const mockUserRepo = {
        findByEmail: email => { return Promise.resolve(true); }
    };

    beforeAll(() => {
        spyOn(mockAuthService, 'getJwt').and.returnValue(Promise.resolve("jwt.object"));
        spyOn(mockCryptoService, 'comparePassword').and.returnValue(Promise.resolve(true));
        spyOn(mockUserRepo, 'findByEmail').and.returnValue(Promise.resolve('User exists!'));
        loginService = new UserLoginService(mockUserRepo, mockCryptoService, mockAuthService);
    });

    it("sanity check", () => {
        expect(loginService).not.toBeNull();
    });

    it("valid user should be logged in successfully", () => {
        // Arrange
        const dto = {
            username: 'homer.simpson@email.com',
            password: 'Password11'
        };

        // Act
        loginService.login(dto)
        .then(res => {
            expect(mockUserRepo.findByEmail).toHaveBeenCalled();
            expect(mockCryptoService.comparePassword).toHaveBeenCalled();
            expect(mockAuthService.getJwt).toHaveBeenCalled();
            done();
        },
        err => {
            fail("Valid user should be logged in successfully!");            
        });
    });

    it("invalid user cannot be logged in", () => {
        // Arrange
        const dto = {
            username: 'mr.i.dont.exist@email.com',
            password: 'Password11'
        };
        const mockUserRepoWithInvalidUser = {
            findByEmail: email => { return Promise.reject('User does not exist!'); }
        };
        spyOn(mockUserRepoWithInvalidUser, 'findByEmail').and.returnValue(Promise.reject('User does not exist!'));
        const service = new UserLoginService(mockUserRepoWithInvalidUser, mockCryptoService, mockAuthService);

        // Act
        service.login(dto)
            .then(res => {
                fail("User cannot be logged in if they do not exist in the database");
            },
            err => {
                expect(mockUserRepo.findByEmail).toHaveBeenCalled();
                expect(mockCrypto.comparePassword).not.toHaveBeenCalled();
                expect(mockAuthService.getJwt).not.toHaveBeenCalled();

                //console.log(err);
                expect(err).not.toBeNull();
                expect(err.statusCode).toBe(401);
                expect(err.errorType).toBe('Unauthorized');
                expect(err.errorMessage.length).toBeGreaterThan(3);
                done();
            });
    });

    it("user must not log in with wrong password", () => {
        // Arrange
        const dto = {
            username: 'homer.simpson@email.com',
            password: 'WrongPassword'
        };
        const mockCrypto = {
            comparePassword: (plaintextPassword, hash) => { return Promise.reject('Passwords do not match!');}
        };
        spyOn(mockCrypto, 'comparePassword').and.returnValue(Promise.reject('Password does not match!'));
        const service = new UserLoginService(mockUserRepo, mockCrypto, mockAuthService);

        // Act
        service.login(dto)
            .then(res => {
                fail("User cannot be logged in if their password is wrong");
            },
            err => {
                expect(mockUserRepo.findByEmail).toHaveBeenCalled();
                expect(mockCrypto.comparePassword).toHaveBeenCalled();
                expect(mockAuthService.getJwt).not.toHaveBeenCalled();

                //console.log(err);
                expect(err).not.toBeNull();
                expect(err.statusCode).toBe(401);
                expect(err.errorType).toBe('Unauthorized');
                expect(err.errorMessage.length).toBeGreaterThan(3);
                done();
            });
    });

    // Assertion tests
    describe("asserts", () => {
        it("username", () => {
            // Arrange
            const dto = {
                //username: 'homer.simpson@email.com',
                password: 'Password11'
            };
    
            // Act
            loginService.login(dto)
                .then(res => {
                    fail("Dto should not be asserted without username");
                },
                err => {
                    expect(err).not.toBeNull();
                    expect(err.statusCode).toBe(400);
                    expect(err.errorType).toBe('Validation');
                    expect(err.errorMessage.length).toBeGreaterThan(3);
                    done();
                });
        });

        it("password", () => {
            // Arrange
            const dto = {
                username: 'homer.simpson@email.com',
                //password: 'Password11'
            };
    
            // Act
            loginService.login(dto)
                .then(res => {
                    fail("Dto should not be asserted without password");
                },
                err => {
                    expect(err).not.toBeNull();
                    expect(err.statusCode).toBe(400);
                    expect(err.errorType).toBe('Validation');
                    expect(err.errorMessage.length).toBeGreaterThan(3);
                    done();
                });
        });
    });
});