// Validation Helpers

export const validationHelper = {
    validateEmail: email => {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    },

    validatePassword: password => {
        // https://gist.github.com/ravibharathii/3975295
        // Rules:
        // Must have at least 1 uppercase letter
        // Must have at least 1 lowercase letter
        // Must have at least 1 number or special character
        // Must have at least 8 characters in length
        // Does not have maximum length
        const regex = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
        return regex.test(password);
    }
};