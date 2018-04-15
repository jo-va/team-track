export const SIGNIN_CONSTRAINTS = {
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
    },
    Loginpassword: {
        presence: {
            allowEmpty: false,
            message: '^Please enter a password'
        }
    }
};

export default SIGNIN_CONSTRAINTS;
