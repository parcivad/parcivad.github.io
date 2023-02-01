//const apiUrl = "https://api.parcivad.de"
const apiUrl = "http://127.0.0.1:3000"

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

function formCheck() {
    let validInput = true,
        fields = ["#name", "#password"];

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

    // return valid
    return validInput;
}

function login() {
    if (formCheck()) {
        let $errorLabel = $("#register-error");
        let name = $("#name").val().split(".", 2),
            firstname = name[0],
            lastname = name[1];

        console.debug(firstname)
        console.debug(lastname)


        fetch(`${apiUrl}/student/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name": {
                    "firstname": firstname,
                    "lastname": lastname
                },
                "password":$("#password").val()
            })
        })
            .then(response => response.json())
            .then(data => {
                // catch error
                if (isset(data["error_key"])) {
                    $errorLabel.text("Etwas ist schiefgelaufen, bitte überprüfe deinen Namen und dein Passwort")
                    $errorLabel.removeClass("input-valid");
                    $errorLabel.addClass("input-error");
                    return;
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

function isset(o) {return typeof o !== 'undefined';}