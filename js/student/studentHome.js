const apiUrl = "https://api.parcivad.de";

// need authentication
if (!getCookie("token") || !getCookie("refresh_token")) {
    location.assign("/student/login")
}

// load request module
loadModuleFromUrl();

// load sideBar
api("/student/identity", "GET", undefined)
    .then(value => {
        $("#largeTitle").text(`${value["name"]["firstname"]} ${value["name"]["lastname"].split("")[0]}.`)

        if (value["calendarActive"]) $("#calendarActive").removeClass("display-none");
        else $("#calendarActive").addClass("display-none");
    })

function api(endpoint, method, body) {
    return new Promise(function (resolve, reject) {
        call(endpoint, method, body, getCookie("token"))
            .then(value => {
                // catch error
                if (isset(value["error_key"])) {
                    if (value["error_key"] === "token_expired") {
                        call("/student/refreshToken", "POST", undefined, getCookie("refresh_token"))
                            .then(value => {
                                // on error quit
                                if (isset(value["error_key"])) {
                                    // reset session
                                    eraseCookies();
                                    location.assign("/student/login")
                                    reject();
                                }

                                setCookies(value)
                                // try again
                                call(endpoint, method, body, getCookie("token"))
                                    .then(value => {
                                        // on error quit
                                        if (isset(value["error_key"])) {
                                            // reset session
                                            eraseCookies();
                                            location.assign("/student/login")
                                            reject();
                                        }
                                        resolve(value);
                                    })
                            })
                    }
                }
                resolve(value);
            })
    })
}

/**
 * calling api endpoint
 * @param endpoint Endpoint
 * @param method Method ("GET", "PUT", "POST"...)
 * @param body Body (JSONStringify)
 * @param token JWT Token
 * @returns {Promise<unknown>}
 */
function call(endpoint, method, body, token) {
    return new Promise(function (resolve, reject) {
        fetch(`${apiUrl}${endpoint}`, {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: body
        })
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(error => reject(error))
    });
}

/**
 * Sets all needed Cookies from data
 * @param data Authentication data
 */
function setCookies(data) {
    setCookie("token", data["token"], 1);
    setCookie("refresh_token", data["refresh_token"], 1);
    setCookie("expiresIn", data["expiresIn"], 1);
    setCookie("token_type", data["token_type"], 1);
}

/**
 * Erasing all cookies of the user
 */
function eraseCookies() {
    eraseCookie("token");
    eraseCookie("refresh_token");
    eraseCookie("expiresIn");
    eraseCookie("token_type");
}

/**
 * Removing authentication jwt and redirect
 */
function logout() {
    eraseCookies();
    location.assign("/student/login");
}

/*
 * Loading modules into the load
 * @param moduleName Name of Html module
 */
function loadModule(moduleName) {
    let params = new URLSearchParams(window.location.search);
    params.delete("t");
    params.set("t", moduleName);
    window.location.search = params;
}

function loadModuleFromUrl() {
    animateLoadByType("contentView", "100%", "dots");
    let moduleName = new URLSearchParams(window.location.search).get("t");
    if (moduleName === null) return;

    fetch(`/student/home/modules/${moduleName}.html`)
        .then(response=> response.text())
        .then(text=> {
            document.getElementById('contentView').innerHTML = text

            let newscript = document.createElement("script");
            newscript.text = text.split("<script>")[1].replace("</script>", "");
            document.head.appendChild(newscript);

            animateStop("contentView");
        })
        .catch(error => {
            animateError("contentView");
        });
}

function isset(o) {return typeof o !== 'undefined';}