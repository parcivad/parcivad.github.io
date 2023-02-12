validateClient();
loadSidebar();

var identity;

/**
 * Sets Student Title and looks to adjust icons on response
 */
function loadSidebar() {
    // load student identity
    api("/student/identity", "GET", undefined)
        .then(value => {
            identity = value;
            $("#largeTitle").text(`${value["name"]["firstname"]} ${value["name"]["lastname"].split("")[0]}.`)

            if (value["calendarActive"]) $("#calendarActive").removeClass("display-none");
            else $("#calendarActive").addClass("display-none");
        })
}

/**
 * Client has to have cookies with jwt token
 */
function validateClient() {
    if (!getCookie("token") || !getCookie("refresh_token")) {
        location.assign("/student/login")
    }
}

/**
 * Quick tool function to log out the user
 */
function logout() {
    eraseCookies();
    location.assign("/student/login");
}

function isset(o) {return typeof o !== 'undefined';}

function timeFormat(i) { if (i<10) { return "0"+i } else { return i }}