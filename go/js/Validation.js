/**
 * Validation is a set of functions that returns a given message in case of "not-validated" or non if "validated"!!!
 * @author Timur Stegmann
 */

function validateLength(val, min, max) {
    if (val.length < min) return `noch ${min-val.length} Zeichen`;
    if (val.length > max) return `${val.length-max} Zeichen weniger`;
    return ""
}

function validateEmail(email) {
    let format = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    if (!format.test(email)) return "Gültige Email eintragen"
    return ""
}