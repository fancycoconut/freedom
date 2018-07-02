// Validation Helper Tests
import { validationHelper } from '../../helpers/validationHelpers';

describe ("Validation Helper Tests:", () => {
    describe("password validation", () => {
        it("passwords cannot contain only lowercase", () => {
            const valid = validationHelper.validatePassword("amivalidpassword");
            expect(valid).not.toBe(true);
        });

        it("passwords cannot contain only uppercase", () => {
            const valid = validationHelper.validatePassword("AMIAVALIDPASSWORD");
            expect(valid).not.toBe(true);
        });

        it("passwords cannot contain only numerics", () => {
            const valid = validationHelper.validatePassword("01234567890");
            expect(valid).not.toBe(true);
        });

        it("passwords cannot be less than 8 characters in length", () => {
            const valid = validationHelper.validatePassword("H4yIAm1");
            expect(valid).not.toBe(true);
        });

        it("valid weak password", () => {
            const valid = validationHelper.validatePassword("Password11");
            expect(valid).toBe(true);
        });
    });
});