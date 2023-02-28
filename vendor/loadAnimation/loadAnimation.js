
/**
 * Add the loading animation in and hide the id content
 * @param id
 * @param height
 */
function animateLoadByType(id, height, type) {
    $(`#${id}`).addClass("container-none");
    // check if the load already exists
    if ($(`#animate${id}`).length !== 0) return

    switch (type) {
        case "bricks":
            $(`#${id}`).parent().append(`<div id="animate${id}" class="container-loading" style="width: 100%; height: ${height}"><div class="building-blocks"><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>`);
            break;

        case "spinner":
            $(`#${id}`).parent().append(`<div id="animate${id}" class="container-loading" style="width: 100%; height: ${height}"><div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>`);
            break;

        case "dots":
            $(`#${id}`).parent().append(`<div id="animate${id}" class="container-loading" style="width: 100%; height: ${height}"><div class="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`);
            break;
    }
}

/**
 * Add red color to loading
 * @param id
 */
function animateError(id) {
    $(`#animate${id}`).addClass("loading-error");
}

/**
 * Remove loading content and remove hide class from id
 * @param id
 */
function animateStop(id) {
    $(`#animate${id}`).remove();
    $(`#${id}`).removeClass("container-none");
}