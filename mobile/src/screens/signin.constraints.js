export const SIGNUP_CONSTRAINTS = {
    email: {
        presence: {
            allowEmpty: false,
            message: '^Please provide an email address'
        },
        email: {
            message: '^Please enter a valid email adress'
        }
    },
    username: {
        presence: {
            allowEmpty: false,
            message: '^Please provide a username'
        }
    },
    password: {
        presence: {
            allowEmpty: false,
            message: '^Please enter a password'
        },
        length: {
            minimum: 4,
            message: '^Your password must be at least 4 characters'
        }
    },
    confirmationPassword: {
        presence: {
            allowEmpty: false,
            message: '^Please confirm your password'
        },
        equality: {
            attribute: 'password',
            message: '^Passwords must match'
        }
    }
};

export const LOGIN_CONSTRAINTS = {
    identifier: {
        presence: {
            allowEmpty: false,
            message: '^Please provide a username or email'
        }
    },
    password: {
        presence: {
            allowEmpty: false,
            message: '^Please enter a password'
        }
    }
};
