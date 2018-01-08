const MIN_USER_LEN = 5, MAX_USER_LEN = 16;
const MIN_PASS_LEN = 6, MAX_PASS_LEN = 160;

export function validateCredentials(username: string, password: string, email?: string, remember?: boolean): ResponseModel {
    const response: ResponseModel = {errors: [], data: undefined};

    // username validation
    if (username === undefined) {
        response.errors.push(`Username not found.`);
    } else if (username.length > MAX_USER_LEN) {
        response.errors.push(`Username too long. Must be at most ${MAX_USER_LEN} characters.`);
    } else if (username.length < MIN_USER_LEN) {
        response.errors.push(`Username too short. Must be at least ${MIN_USER_LEN} characters.`);
    }

    // password validation
    if (password === undefined) {
        response.errors.push(`Password not found.`);
    } else if (password.length > MAX_PASS_LEN) {
        response.errors.push(`Password too long. Must be at most ${MAX_PASS_LEN} characters.`);
    } else if (password.length < MIN_PASS_LEN) {
        response.errors.push(`Password too short. Must be at least ${MIN_PASS_LEN} characters.`);
    }

    // email validation
    if (email !== undefined) {
        if (email !== ``) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(email.toLowerCase())) {
                response.errors.push(`Email is not in a valid format.`);
            }
        } else {
            response.errors.push(`No email address provided.`);
        }
    }

    // remember me validation
    if (remember) {
        if (!Boolean(remember)) {
            response.errors.push(`Remember me is not a boolean.`);
        }
    }

    return response;

}

export interface ResponseModel {
    errors: string[];
    data: any;
}