/**
 * @author Timur Stegmann
 */

const apiUrl = "https://api.parcivad.de"

/**
 * Send request via call function and handles token
 * @param endpoint  Endpoint of the API
 * @param method    Method ("GET", "POST"...)
 * @param body      Request Body JSON.stringify
 * @returns {Promise<unknown>}
 */
function api(endpoint, method, body) {
    return new Promise(function (resolve, reject) {
        call(endpoint, method, body, getCookie("token"))
            .then(value => {
                // catch error
                if (isset(value["error_key"])) {
                    if (value["error_key"] === "token_expired") {
                        call("/studentHome/refreshToken", "POST", undefined, getCookie("refresh_token"))
                            .then(value => {
                                // on error quit
                                if (isset(value["error_key"])) {
                                    // reset session
                                    logout()
                                    reject();
                                }

                                setCookies(value)
                                // try again
                                call(endpoint, method, body, getCookie("token"))
                                    .then(value => {
                                        // on error quit
                                        if (isset(value["error_key"])) {
                                            // reset session
                                            logout()
                                            reject();
                                        }
                                        resolve(value);
                                    })
                            })
                    }
                }
                resolve(value);
            })
            .catch(error => {
                logout();
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
function call(endpoint, method, body, token) {
    let headers = {'Content-Type': 'application/json'};
    if (token !== null) headers = {'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'};

    return new Promise(function (resolve, reject) {
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
    setCookie("token", data["token"], 1);
    setCookie("refresh_token", data["refresh_token"], 1);
    setCookie("expiresIn", data["expiresIn"], 1);
    setCookie("token_type", data["token_type"], 1);
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
