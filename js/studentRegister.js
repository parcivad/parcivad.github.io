const apiUrl = "https://api.parcivad.de"
const apiDomain = "api.parcivad.de"

loadCourse();

function loadCourse() {
    // Load register card
    animateLoad("registerView", 350)
    fetch(`${apiUrl}/student/courses`)
        .then(response => response.json())
        .then(data => {
            data.forEach(course => {
                // create html element and push it under the playerlist div
                $("#courseSelector").append(`<option value="${course["courseId"]}">${course["courseName"]}</option>`)
            })
        
            var options = $('#courseSelector option');
            var arr = options.map(function(_, o) { return { t: $(o).text(), v: o.value }; }).get();
            arr.sort(function(o1, o2) { return o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0; });
            options.each(function(i, o) {
              o.value = arr[i].v;
              $(o).text(arr[i].t);
            });

            // end loading animation
            animateStop("registerView")
        })
        .catch(error => {
            // display error on loading
            animateError("registerView")
        });
}

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
            let ua = navigator.userAgent.toLowerCase();
            let isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
            if(isAndroid) {
                // open with google calender
                location.assign(`https://calendar.google.com/calendar/u/0/r?cid=https://api.parcivad.de/student/feed?studentId=${data.replace('"', '').replace('"', "")}`)
            } else {
                // open with apple calendar
                location.assign(`webcal://${apiDomain}/student/feed?studentId=${data.replace('"', '').replace('"', "")}`)
            }

            document.getElementById('firstname').value = "";
            document.getElementById('lastname').value = "";
            document.getElementById('calendarName').value = "";
        })
}
