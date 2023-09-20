/**
 * StudentApi is the heart of all api request going from the go application
 * @author Timur Stegmann
 */

const apiUrl = "https://api.classync.de";

/**
 * Send request via call function and handles token
 * @param endpoint  Endpoint of the API
 * @param method    Method ("GET", "POST"...)
 * @param body      Request Body JSON.stringify
 * @returns {Promise<unknown>}
 */
async function api(endpoint, method, body) {
    return await new Promise(function (resolve, reject) {
        call(endpoint, method, body, getCookie("token"))
            .then(value => {
                // catch error
                if (isset(value["error_key"])) {
                    if (value["error_key"] === "authentication_required") OAuthProcessRequired()

                    if (value["error_key"] === "token_expired") {

                        call("/student/refreshToken", "POST", undefined, getCookie("refresh_token"))
                            .then(value => {
                                // on error quit
                                if (isset(value["error_key"])) {
                                    // reset session
                                    OAuthProcessRequired()
                                    reject(value);
                                }

                                setCookies(value)
                                // try again
                                call(endpoint, method, body, value.token)
                                    .then(value => {
                                        // on error quit
                                        if (isset(value["error_key"])) {
                                            // reset session
                                            OAuthProcessRequired()
                                            reject(value);
                                        }

                                        resolve(value);
                                    })
                                    .catch(error => {
                                        OAuthProcessRequired()
                                        reject(error);
                                    })
                            })
                            .catch(error => {
                                OAuthProcessRequired()
                                reject(error);
                            })

                    } else {
                        reject(value);
                    }
                } else {
                    resolve(value)
                }

            })
            .catch(error => {
                reject(error)
            })
    })
}

/**
 * fetching api endpoint with given parameters
 * @param endpoint  Endpoint of the API
 * @param method    Method ("GET", "POST"...)
 * @param body      Body JSON.Stringify
 * @param token     JWT Token
 * @returns {Promise<unknown>}
 */
async function call(endpoint, method, body, token) {
    let headers = {'Content-Type': 'application/json'};
    if (token !== null) headers = {'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'};

    return await new Promise(function (resolve, reject) {
        fetch(`${apiUrl}${endpoint}`, {
            method: method,
            headers: headers,
            body: body
        })
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(error => reject(error))
    });
}

/**
 * Sets all needed Cookies from data response data
 * @param data Authentication data
 */
function setCookies(data) {
    setCookie("token", data["token"], 4);
    setCookie("refresh_token", data["refresh_token"], 4);
    setCookie("expiresIn", data["expiresIn"], 4);
    setCookie("token_type", data["token_type"], 4);
}

/**
 * Erasing all cookies of the client browser
 */
function eraseCookies() {
    eraseCookie("token");
    eraseCookie("refresh_token");
    eraseCookie("expiresIn");
    eraseCookie("token_type");
}

/**
 * Is Object set
 * @param o     Object
 * @returns {boolean}
 */
function isset(o) {return typeof o !== 'undefined';}

function timeFormat(i) { if (i<10) { return "0"+i } else { return i }}
