
loadForm()
    .then(resolve => {
        // load multipleselect for desktop
        if (!('ontouchstart' in window)) {
            var fileRef = document.createElement('script');
            fileRef.setAttribute("type","text/javascript");
            fileRef.setAttribute("src", "/vendor/multiSelect/multiselect-dropdown.js");

            if (typeof fileRef!="undefined") document.getElementsByTagName("head")[0].appendChild(fileRef);
        }
    })
    .catch(error => {
        // block on load err
        animateLoadByType("loginView", "100%", "dots");
        animateError("loginView");
    });

/**
 * Checks form and registers the user on the server
 * Validates from server and continues to home
 */
function register() {
    if (formCheck()) {
        let $errorLabel = $("#register-error");

        // make endpoint call
        call("/student/register", "POST", JSON.stringify({
            "name": {
                "firstname": $("#firstname").val(),
                "lastname": $("#lastname").val()
            },
            "email": $("#mail").val(),
            "password": $("#password").val(),
            "grade": $("#grade option:selected").val(),
            "courses": Object.assign([], getCourses())
        }), null)
            .then(value => {
                // catch error
                if (isset(value["error_key"])) {
                    switch (value["error_key"]) {
                        case 'request_not_valid':
                            $errorLabel.text("Etwas ist schiefgelaufen, bitte überprüfe deine Eingabe (Passwort mindestens 6 Zeichen)")
                            $errorLabel.removeClass("input-valid");
                            $errorLabel.addClass("input-error");
                            break;
                        case 'request_duplicated':
                            $errorLabel.text("Dieses Konto gibt es bereits. Probiere dich einzuloggen")
                            $errorLabel.removeClass("input-valid");
                            $errorLabel.addClass("input-error");
                            break;
                    }
                    return false;
                }

                // set jwt as Cookies and redirect to Home
                setCookies(value);
                location.assign("/student/home/?t=calendarSubscription");
            })
            .catch(error => {
                // let the client know an error occurred
                $errorLabel.removeClass("input-valid");
                $errorLabel.addClass("input-error");
            })
    }
}

/**
 * Loads all variable input needed
 * @returns {Promise} All loaded
 */
function loadForm() {
    return new Promise(function (resolve, reject) {
        // fetch courses and put it as an option
        animateLoadByType("loginView", "100%", "dots")
        loadGrades()
            .then(data => {
                loadCourses()
                    .then(data => {
                        animateStop("loginView");
                        resolve();
                    })
                    .catch(error => {
                        animateError("loginView");
                        reject();
                    })
            })
            .catch(error => {
                animateStop("loginView");
                reject();
            })
    })
}

/**
 * Loads all grades from API and adds to Select HTML
 * @returns {Promise<unknown>}
 */
function loadGrades() {
    return new Promise(function (resolve, reject) {
        // making endpoint call for all grades
        call("/student/grades", "GET", null, null)
            .then(value => {
                // add all courses and sort
                let firstSelect = "selected";
                for (let i=0; i < value.length; i++) {
                    let grade = value[i];
                    // create html element and push it under the class selector
                    $("#grade").append(`<option ${firstSelect} value="${grade["gradeId"]}">${grade["gradeName"]}</option>`)
                    firstSelect = "";
                }
                sortSelect("grade");

                resolve()
            })
            .catch(error => {
                reject();
            })
    })
}

/**
 * Loads all courses from API and adds to Select HTML
 * @returns {Promise<unknown>}
 */
function loadCourses() {
    return new Promise(function (resolve, reject) {
        // making endpoint call
        call(`/student/courses?gradeId=${$("#grade option:selected").val()}`, "GET", null, null)
            .then(value => {
                // add all courses and sort
                value.forEach(course => {
                    $("#courses").append(`<option value="${course["courseId"]}">${course["courseName"]}</option>`)
                })
                sortSelect("courses");

                resolve();
            })
            .catch(error => {
                reject();
            })
    });
}

/**
 * Builds Mail from first and lastname
 */
function buildMail() {
    $("#mail").val(`${$("#firstname").val().toLowerCase()}.${$("#lastname").val().toLowerCase()}@loewenrot-gymnasium.de`)
}

/**
 * Checks given input fields of input
 * @returns {boolean}
 */
function formCheck() {
    let validInput = true,
        fields = ["#grade", "#courses", "#firstname", "#lastname", "#password"];

    // id
    let cookiesError = $("#cookies_agree-error"),
        courseError = $("#courses-error");

    fields.forEach(field => {
        let fieldElement = $(`${field}-error`);

        if ($(field).val() === "") {
            // if not valid
            fieldElement.removeClass("input-valid")
            fieldElement.addClass("input-error")
            validInput = false;

        } else {
            // if valid
            fieldElement.addClass("input-valid")
            fieldElement.removeClass("input-error")
        }
    })

    if (!$("#cookies_agree").is(":checked")) {
        cookiesError.removeClass("input-valid")
        cookiesError.addClass("input-error")
        validInput = false;
    } else {
        cookiesError.addClass("input-valid")
        cookiesError.removeClass("input-error")
    }

    if ($(`${"#courses"} option:selected`).val() === undefined) {
        courseError.removeClass("input-valid")
        courseError.addClass("input-error")
        validInput = false;
    } else {
        // if valid
        courseError.addClass("input-valid")
        courseError.removeClass("input-error")
    }

    // return valid
    return validInput;
}

/**
 * Return list of courses from the select
 * @return {any[] | jQuery}
 */
function getCourses() {
    return $('#courses option:selected').map(function () {
        return $(this).val();
    }).toArray();
}

/**
 * Sorts a select list in alphabetic order
 * @param id    ID of the HTML Select
 */
function sortSelect(id) {
    let options = $(`#${id} option`);
    let arr = options.map(function (_, o) {
        return {t: $(o).text(), v: o.value};
    }).get();
    arr.sort(function (o1, o2) {
        return o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0;
    });
    options.each(function (i, o) {
        o.value = arr[i].v;
        $(o).text(arr[i].t);
    })
}
