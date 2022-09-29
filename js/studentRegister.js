const apiUrl = "https://api.parcivad.de"
const apiDomain = "api.parcivad.de"

// Load register card
animateLoad("registerView")
fetch(`${apiUrl}/student/courses`)
    .then(response => response.json())
    .then(data => {
        data.forEach(course => {
            // create html element and push it under the playerlist div
            $("#courseSelector").append(`<option value="${course["courseId"]}">${course["courseName"]}</option>`)
        })

        // end loading animation
        animateStop("registerView")
    })
    .catch(error => {
        // display error on loading
        animateError("registerView")
    });

/**
 * Return list of courses from the select
 * @return {any[] | jQuery}
 */
function getCourses() {
    return $('select[id="courseSelector"] option:selected').map(function () {
        return $(this).val();
    }).toArray();
}

/**
 * Makes an api call to create the user
 */
function registerUser() {
    let firstname = $("#firstname").val(),
        lastname = $("#lastname").val(),
        calendarName = $("#calendarName").val(),
        courses = getCourses(),
        alarm = document.getElementById('alarm').checked,
        emoji = document.getElementById('emoji').checked;

    if (firstname === "" || lastname === "" || calendarName === "" || courses.length === 0) {
        $("#calenderButton").addClass("button-calendar-wrong");
        console.log("required fields not filled!")
        return;
    }

    let coursesJson = JSON.stringify(Object.assign([], courses));
    let body = `{"name":{"firstname": "${firstname}","lastname": "${lastname}"},"courses": ${coursesJson},"calendarOptions": {"name": "${calendarName}","emoji": ${emoji},"alarm": ${alarm}}}`;

    fetch(`${apiUrl}/student/add`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PUT",
        body: body
    })
        .then(response => response.text())
        .then(data => {
            if (data === "" || data.includes("error")) {
                $("#calenderButton").addClass("button-calendar-wrong");
                console.log("can't create user")
                return;
            }
            // remove red
            $("#calenderButton").removeClass("button-calendar-wrong");
            // open calendar
            location.assign(`webcal://${apiDomain}/student/feed?studentId=${data.replace('"', '').replace('"', "")}`)
        })
}