const apiUrl = "https://api.parcivad.de"

/**
 * JQuery reacting to keyboard to skip through login
 */
$(".input-group").on('keydown', 'input', function (event) {
    if (event.which === 13) {
        event.preventDefault();
        let $this = $(event.target);
        let index = parseFloat($this.attr('data-index'));
        $('[data-index="' + (index + 1) + '"]').focus().click();
    }
});

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
                        console.debug(error)
                        reject();
                    })
            })
            .catch(error => {
                animateStop("loginView");
                console.debug(error);
                reject();
            })
    })
}

function loadGrades() {
    return new Promise(function (resolve, reject) {
        fetch(`${apiUrl}/student/grades`)
            .then(response => response.json())
            .then(grades => {

                let firstSelect = "selected";
                for (let i=0; i < grades.length; i++) {
                    let grade = grades[i];
                    // create html element and push it under the class selector
                    $("#grade").append(`<option ${firstSelect} value="${grade["gradeId"]}">${grade["gradeName"]}</option>`)
                    firstSelect = "";
                }

                let options = $('#grade option');
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
                resolve();
            })
            .catch(error => {
                reject();
            });
    })
}

function loadCourses() {
    return new Promise(function (resolve, reject) {
        fetch(`${apiUrl}/student/courses?gradeId=${$("#grade option:selected").val()}`)
            .then(response => response.json())
            .then(courses => {
                for (let i = 0; i < courses.length; i++) {
                    let course = courses[i];
                    // create html element and push it under the class selector
                    $("#courses").append(`<option value="${course["courseId"]}">${course["courseName"]}</option>`)

                }

                let options = $('#courses option');
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
                resolve();
            })
            .catch(error => {
                reject();
            })
    });
}

/**
 * Builds Mail from
 */
function buildMail() {
    $("#mail").val(`${$("#firstname").val().toLowerCase()}.${$("#lastname").val().toLowerCase()}@loewenrot-gymnasium.de`)
}

function formCheck() {
    let validInput = true,
        fields = ["#grade", "#courses", "#firstname", "#lastname", "#password"];

    for (let i=0; i < fields.length; i++) {
        // if there is no input
        if ($(fields[i]).val() === "") {
            $(fields[i]+"-error").removeClass("input-valid")
            $(fields[i]+"-error").addClass("input-error")
            validInput = false;
            continue;
        }
        // if valid
        $(fields[i]+"-error").addClass("input-valid")
        $(fields[i]+"-error").removeClass("input-error")
    }

    if (!$("#cookies_agree").is(":checked")) {
        $("#cookies_agree-error").removeClass("input-valid")
        $("#cookies_agree-error").addClass("input-error")
        validInput = false;
    } else {
        $("#cookies_agree-error").addClass("input-valid")
        $("#cookies_agree-error").removeClass("input-error")
    }

    if ($(`${"#courses"} option:selected`).val() === undefined) {
        $("#courses-error").removeClass("input-valid")
        $("#courses-error").addClass("input-error")
        validInput = false;
    } else {
        // if valid
        $("#courses-error").addClass("input-valid")
        $("#courses-error").removeClass("input-error")
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
 * Checks form and registers the user on the server
 * Validates from server and continues to home
 */
function register() {
    if (formCheck()) {

        let $errorLabel = $("#register-error"),
            coursesJson = JSON.stringify(Object.assign([], getCourses())),
            body = `{"name":{"firstname": "${$("#firstname").val()}","lastname": "${$("#lastname").val()}"},"email": "${$("#mail").val()}","password": "${$("#password").val()}","grade": "${$("#grade option:selected").val()}","courses": ${coursesJson}}`;


        fetch(`${apiUrl}/student/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        })
            .then(response => response.json())
            .then(data => {
                // catch error
                if (data["error_key"]) {
                    switch (data["error_key"]) {
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

                setCookie("token", data["token"], 1);
                setCookie("refresh_token", data["refresh_token"], 1);
                setCookie("expiresIn", data["expiresIn"], 1);
                setCookie("token_type", data["token_type"], 1);
                location.assign("/student/home/?t=calendarSubscription");

            })
            .catch(error => {
                $errorLabel.removeClass("input-valid");
                $errorLabel.addClass("input-error");
            })
    }
}