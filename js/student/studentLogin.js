/**
 * Tries to log the user in with given values
 */
function login() {
    // checking raw for correct input value
    if (formCheck()) {
        let $errorLabel = $("#register-error"),
            name = $("#name").val().split(".", 2),
            firstname = name[0],
            lastname = name[1];

        // making endpoint call
        call("/student/login", "POST", JSON.stringify({
            "name": {
                "firstname": firstname,
                "lastname": lastname
            },
            "password": $("#password").val()
        }), null)
            .then(value => {
                // catch error
                if (isset(value["error_key"])) {
                    $errorLabel.text("Etwas ist schiefgelaufen, bitte überprüfe deinen Namen und dein Passwort")
                    $errorLabel.removeClass("input-valid");
                    $errorLabel.addClass("input-error");
                    return;
                }

                // save jwt in cookies and redirect to Home
                setCookies(value)
                location.assign("/student/home/?t=calendarSubscription");

            })
            .catch(error => {
                // showing the client that an error occurred
                $errorLabel.removeClass("input-valid");
                $errorLabel.addClass("input-error");
            })
    }
}

/**
 * Checking given input fields of there value
 * @returns {boolean}
 */
function formCheck() {
    let validInput = true,
        fields = ["#name", "#password"];

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

    // return valid
    return validInput;
}