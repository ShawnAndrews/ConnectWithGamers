const MIN_USER_LEN = 5, MAX_USER_LEN = 16
const MIN_PASS_LEN = 6, MAX_PASS_LEN = 160

module.exports.validateCredentials = (username, password, email = null, remember = null) => {
    let response = {error: false, errorMessage: ''}

    // username validation
    if(username == undefined)
    {
        response.error = true;
        response.errorMessage = `Username not found.`;
    }
    else if(username.length > MAX_USER_LEN)
    {
        response.error = true;
        response.errorMessage = `Username too long. Must be at most ${MAX_USER_LEN} characters.`;
    }
    else if(username.length < MIN_USER_LEN)
    {
        response.error = true;
        response.errorMessage = `Username too short. Must be at least ${MIN_USER_LEN} characters.`;
    }

    // password validation
    if(password == undefined)
    {
        response.error = true;
        response.errorMessage = `Password not found.`;
    }
    else if(password.length > MAX_PASS_LEN)
    {
        response.error = true;
        response.errorMessage = `Password too long. Must be at most ${MAX_PASS_LEN} characters.`;
    }
    else if(password.length < MIN_PASS_LEN)
    {
        response.error = true;
        response.errorMessage = `Password too short. Must be at least ${MIN_PASS_LEN} characters.`;
    }

    // email validation
    if(email)
    {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(!re.test(email.toLowerCase()))
        {
            response.error = true;
            response.errorMessage = `Email is not in a valid format.`;
        }
    }

    // remember me validation
    if(remember)
    {
        if(!Boolean(remember))
        {
            response.error = true;
            response.errorMessage = `Remember me is not a boolean.`;
        }
    }

    return response;

}