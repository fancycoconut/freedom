// Registration Service Tests
import { validationHelper } from '../../helpers/validationHelpers';
import { UserRegistrationService } from '../../services/index';

describe("Registration Service Tests:", () => {
    let registrationService = null;
    const mockCrypto = {
        getPasswordSalt: () => "random.salt",
        getPasswordHash: (plaintext, salt) => "random.hash"
    };
    const mockUserRepo = {
        findByEmail: email => true,
        add: user => true
    };

    beforeAll(() => {
        spyOn(mockCrypto, 'getPasswordSalt').and.returnValue(Promise.resolve("random.salt"));
        spyOn(mockCrypto, 'getPasswordHash').and.returnValue(Promise.resolve("random.hash"));
        spyOn(mockUserRepo, 'findByEmail').and.returnValue(Promise.reject("User does not exist"));
        spyOn(mockUserRepo, 'add').and.returnValue(Promise.resolve("User added successfully!"));

        registrationService = new UserRegistrationService(mockUserRepo, validationHelper, mockCrypto);
    });

    it("sanity check", () => {
        expect(registrationService).not.toBeNull();
    });

    it("same user cannot be registered twice", () => {
        // Arrange
        const dto = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@email.com',
            password: 'Password11',
            confirmPassword: 'Password11'
        };
        const mockUserRepoWithExistingUser = {
            findByEmail: email => { return true; },
            add: user => { return true; }
        };
        spyOn(mockUserRepoWithExistingUser, 'findByEmail').and.returnValue(Promise.resolve("User already exists!"));
        spyOn(mockUserRepoWithExistingUser, 'add').and.returnValue(Promise.resolve("User added successfully!"));
        const service = new UserRegistrationService(mockUserRepoWithExistingUser, validationHelper, mockCrypto);

        // Act
        service.registerNewUser(dto)
            .then(res => {
                fail("Same user cannot be registered twice!");                
            },
            err => {
                expect(err).not.toBeNull();
                expect(err.statusCode).toBe(400);
                expect(err.errorType).toBe('Bad Request');
                expect(err.errorMessage.length).toBeGreaterThan(3);

                expect(mockUserRepoWithExistingUser.findByEmail).toHaveBeenCalled();
                expect(mockCrypto.getPasswordSalt).not.toHaveBeenCalled();
                expect(mockCrypto.getPasswordHash).not.toHaveBeenCalled();
                expect(mockUserRepoWithExistingUser.add).not.toHaveBeenCalled();
                done();
            });
    });

    it("valid user registers successfully", () => {
        // Arrange
        const dto = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@email.com',
            password: 'Password11',
            confirmPassword: 'Password11'
        };

        // Act
        registrationService.registerNewUser(dto)
            .then(res => {
                expect(mockUserRepo.findByEmail).toHaveBeenCalled();
                expect(mockCrypto.getPasswordSalt).toHaveBeenCalled();
                expect(mockCrypto.getPasswordHash).toHaveBeenCalled();
                expect(mockUserRepo.add).toHaveBeenCalled();
                done();
            },
            err => {
                console.log(err);
                fail("Valid user should be registered successfully!");
            });
    });

    // Validation tests
    describe("validation", () => {
        it("invalid email", () => {
            // Arrange
            const dto = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@email',
                password: 'Password11',
                confirmPassword: 'Password11'
            };
    
            // Act
            registrationService.registerNewUser(dto)
                .then(res => {
                    fail("Validation should fail for invalid emails");
                },
                err => {
                    expect(err).not.toBeNull();
                    expect(err.statusCode).toBe(400);
                    expect(err.errorType).toBe('Validation');
                    expect(err.errorMessage.length).toBeGreaterThan(3);
                    done();
                });
        });

        it("invalid email length", () => {
            // Arrange
            const dto = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'jo',
                password: 'Password11',
                confirmPassword: 'Password11'
            };
    
            // Act
            registrationService.registerNewUser(dto)
                .then(res => {
                    fail("Validation should fail for invalid emails with less than 3 characters");
                },
                err => {
                    expect(err).not.toBeNull();
                    expect(err.statusCode).toBe(400);
                    expect(err.errorType).toBe('Validation');
                    expect(err.errorMessage.length).toBeGreaterThan(3);
                    done();
                });
        });
    
        it("passwords should match", () => {
            // Arrange
            const dto = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@email.com',
                password: 'Password11',
                confirmPassword: 'Password12'
            };
    
            // Act
            registrationService.registerNewUser(dto)
                .then(res => {
                    fail("Validation should fail for paswords that do not match");
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

    // Assertion tests
    describe("asserts", () => {
        it("firstName", () => {
            // Arrange
            const dto = {
                //firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@email.com',
                password: 'Password11',
                confirmPassword: 'Password11'
            };
    
            // Act
            registrationService.registerNewUser(dto)
                .then(res => {
                    fail("Dto should not be asserted without first name");
                },
                err => {
                    expect(err).not.toBeNull();
                    expect(err.statusCode).toBe(400);
                    expect(err.errorType).toBe('Validation');
                    expect(err.errorMessage.length).toBeGreaterThan(3);
                    done();
                });
        });
    
        it("lastName", () => {
            // Arrange
            const dto = {
                firstName: 'John',
                //lastName: 'Doe',
                email: 'john.doe@email.com',
                password: 'Password11',
                confirmPassword: 'Password11'
            };
    
            // Act
            registrationService.registerNewUser(dto)
                .then(res => {
                    fail("Dto should not be asserted without last name");
                },
                err => {
                    expect(err).not.toBeNull();
                    expect(err.statusCode).toBe(400);
                    expect(err.errorType).toBe('Validation');
                    expect(err.errorMessage.length).toBeGreaterThan(3);
                    done();
                });
        });
    
        it("email", () => {
            // Arrange
            const dto = {
                firstName: 'John',
                lastName: 'Doe',
                //email: 'john.doe@email.com',
                password: 'Password11',
                confirmPassword: 'Password11'
            };
    
            // Act
            registrationService.registerNewUser(dto)
                .then(res => {
                    fail("Dto should not be asserted without email");
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
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@email.com',
                //password: 'Password11',
                confirmPassword: 'Password11'
            };
    
            // Act
            registrationService.registerNewUser(dto)
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

        it("confirmPassword", () => {
            // Arrange
            const dto = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@email.com',
                password: 'Password11',
                //confirmPassword: 'Password11'
            };
    
            // Act
            registrationService.registerNewUser(dto)
                .then(res => {
                    fail("Dto should not be asserted without confirmPassword");
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