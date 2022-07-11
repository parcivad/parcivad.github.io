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
    // check ui
    updateUI();

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
        // end class loading mark
        $("#classworkTable").removeClass("loading");
    }
}

/**
 * Updates List of Classes
 * @return {Promise<unknown>}
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
            reject(err);
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
    window.history.pushState('save school calender options', 'Parcivad | SIC', `/sic/?school=${id}&class=${cl}`);

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
    // alternative
    $("#schoolLogo").attr("src", "/img/sic/search.svg");
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