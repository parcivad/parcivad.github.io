/*
 * Function that is called on page opening
 * Analyses the URL for parameters to set
 */
$(function () {
    // check through parameters
    window.location.href.split("?")[1].split("&").forEach(parameter => {
        let key = parameter.split("=")[0],
            value = parameter.split("=")[1];

        switch (key) {
            case "school":
                $("#schoolSelect").val(value);
                break;
            case "class":
                // get all classes to set
                updateClasses()
                    .then(function () {
                        $("#classSelect").val(value);
                        // refresh table
                        updateClassworkTimetable();
                    });
                break;
        }
    });
});

/**
 * Updates Classwork table from set School and Class
 * @return {Promise<void>}
 */
async function updateClassworkTimetable() {
    // mark loading
    $("#classworkTable").addClass("loading");
    // if valid data access
    let id = $("#schoolSelect option:selected").val(),
        cl = $("#classSelect option:selected").val();

}
if (id && cl) {
    // current proxy and target Url
    let proxyUrl = "https://cors-anywhere.herokuapp.com/",
        targetUrl = `http://schulinternes.de/dato40/ifr-kl-termine.php?schule=${id}&klasse=${cl}`;
    // make request
    fetch(proxyUrl + targetUrl)
        .then(function (response) {
            // when done return with text
            return response.text();
        })
        .then(function (html) {
            // search for dates and format them
            let dates = html.split("</colgroup>")[1].split("</table>")[0].split("<tr>");
            dates = dates.slice(2, dates.length);

            // reset table before adding new content
            $("#classworkTableBody").empty();

            // adding each date
            for (let i=0; i<dates.length; i++) {
                if (!dates[i].includes("th")) {
                    // remove parts of html
                    let dateInfo = dates[i].replace("<td>", "").replace("</tr>", "").split("</td>")
                    // add to table
                    $("#classworkTableBody").append('<tr>' +
                        '<th scope="row">'+ dateInfo[0].split(",")[1] +'</th>\n' +
                        '<td>'+ dateInfo[1].replace("<td>", "") +'</td>\n' +
                        '<td>'+ dateInfo[3].replace("<td>", "") +'</td>\n' +
                        '<td>'+ dateInfo[4].replace("<td>", "") +'</td>\n' +
                        '</tr>');
                }
            }

            // end class loading mark
            $("#classworkTable").removeClass("loading");
        }).catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
    });
} else {
    //reset table before adding new content
    $("#classworkTableBody").empty();
    // add to table
    $("#classworkTableBody").append('<tr>\n' +
        '                            <th class="row noEntry" scope="row" colspan="4">\n' +
        '                                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-exclamation-diamond" viewBox="0 0 16 16">\n' +
        '                                    <path d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.482 1.482 0 0 1 0-2.098L6.95.435zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z"/>\n' +
        '                                    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>\n' +
        '                                </svg>\n' +
        '                                Wähle eine Schule und Klasse aus</th>\n' +
        '                        </tr>');
    // end class loading mark
    $("#classworkTable").removeClass("loading");
}

/**
 * Updates List of Classes
 * @return {Promise<boolean>}
 */
function updateClasses() {
    // start selection view
    $("#classSelect").addClass("loading");

    // get school id
    let id = $("#schoolSelect option:selected").val();
    // reset list
    $("#classSelect option").remove();
    // current proxy and target Url
    let proxyUrl = "https://cors-anywhere.herokuapp.com/",
        targetUrl = `http://schulinternes.de/dato40/ifr-kl-termine.php?schule=${id}`;

    return new Promise((resolve, reject) => {
        // make request
        fetch(proxyUrl + targetUrl)
            .then(function (response) {
                // when done return with text
                return response.text();
            })
            .then(function (html) {//
                // search for classes
                let classes = html.split("</select></h3>")[0].split("<option value='");
                classes = classes.slice(1, classes.length);

                for (let i=0; i<classes.length; i++) {
                    // format class
                    classes[i] = classes[i].split("'")[0];
                    $("#classSelect").append(`<option value="${classes[i]}">${classes[i]}</option>`)
                }

                // end class loading mark
                $("#classSelect").removeClass("loading");

                // resolve change
                resolve(true);

            })
            .then(
                // select first item
                $("#classSelect option:first").attr("selected", true)

            ).catch(function (err) {
            // There was an error
            console.warn('Something went wrong.', err);
            // reject error
            reject(false);
        });
    })
}

/**
 * + save class and school in URL
 * + Update UI on any change that effects the data
 */
$("#schoolSelect,#classSelect").change(function () {
    // get set data
    let id = $("#schoolSelect option:selected").val(),
        cl = $("#classSelect option:selected").val();
    if (cl !== undefined) window.history.pushState(
        'save school calender options', 'Parcivad | SIC', `/schoolTracker/?school=${id}&class=${cl}`);

    // array list of school image
    let schoolLogo = {
        "68789lrgym": "https://loewenrot-gymnasium.de/wp-content/uploads/2019/10/logo_LR.jpg",
        "69190gywa": "https://www.gymnasium-walldorf.de/wp-content/uploads/2020/10/Schullogo-1024x1024.png"
    }
    // check for valid logo img
    if (schoolLogo[$("#schoolSelect option:selected").val()] !== undefined) {
        // get school id and change source
        $("#schoolLogo").attr("src", schoolLogo[$("#schoolSelect option:selected").val()]);
        return;
    }
    // if there is no school logo present - reset
    $("#schoolLogo").attr("src", "");
});

/**
 * Event School Select CHANGE
 * Updates List of available classes and updates table
 */
$("#schoolSelect").change(async function () {
    // update Class list
    updateClasses()
        .then(function () {
            // update classwork table
            updateClassworkTimetable();
            console.debug("update table");
        });
});

/**
 * Updates but won't load classes again
 */
$("#classSelect").change(function () {
    // update classwork table
    updateClassworkTimetable();
})