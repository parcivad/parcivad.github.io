/**
 * URL Parameter utils
 * @author Timur Stegmann
 */

/**
 * function to return value by key of url param
 * @param key
 * @returns {string}
 */
function getParam(key) {
    return new URLSearchParams(window.location.search).get(key)
}

/**
 * function to set a key pair value parameter in window search history
 * @param key
 * @param value
 */
function setParam(key, value) {
    // prepare current tag
    let params = new URLSearchParams(window.location.search)
    params.delete(key)
    params.set(key, value)

    // push new url
    let url = window.location.origin+window.location.pathname+"?"+params.toString()
    window.history.pushState({}, '', url)
}

/**
 * function to set a key pair value parameter in window search history
 * @param name
 */
function removeParam(name) {
    // prepare current tag
    let params = new URLSearchParams(window.location.search)
    params.delete(name)

    // push new url
    let url = window.location.origin+window.location.pathname+"?"+params.toString()
    window.history.pushState({}, '', url)
}