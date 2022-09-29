/**
 * Add the loading animation in and hide the id content
 * @param id
 * @param height
 */
function animateLoad(id, height) {
    $(`#${id}`).addClass("container-none");
    // check if the load already exists
    if ($(`#animate${id}`).length !== 0) return
    $(`#${id}`).parent().append(`<div id="animate${id}" class="container-loading" style="width: 100%; height: ${height}px"><div class="building-blocks"><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>`);
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