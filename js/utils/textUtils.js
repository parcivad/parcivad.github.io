/**
 * @author Timur Stegmann
 */

const months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]

const sleep = ms => new Promise(r => setTimeout(r, ms));

const percentage = new Intl.NumberFormat("de-DE", {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})

const currency = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR"
})

/**
 * Format time date in readable date String
 * @param date          Time to format
 * @returns {string}    Return String
 */
function timeToString(date) {
    let time = new Date((Date.now()-date.getTime())),
        timestamp = Math.floor(time.getTime()/1000);

    switch (true) {
        case (timestamp < 60): return `vor ${time.getSeconds()} Sekunden`;

        case (timestamp < 3600): return `vor ${time.getMinutes()} Minuten`;

        case (timestamp < 43200): return `vor ${time.getHours()} Stunden`;

        default: return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
    }
}

/**
 * Filters children of parent via index set in certain attribute
 * @param index         Index to search for
 * @param parent        Parent
 * @param attribute     Attribute to search in
 * @returns {boolean}   found result
 */
function searchFilter(index, parent, attribute) {
    var children = $(`#${parent}`).children(),
        found = false;

    for (let i=0; i < children.length; i++) {
        if (!children[i].getAttribute(attribute).toLowerCase().includes(index.toLowerCase())) {
            children[i].classList.add("display-none");
        } else {
            children[i].classList.remove("display-none");
            found = true;
        }
    }

    return found
}

/**
 * Sorts Children via attribute tag
 * @param id            Parent Element
 * @param attribute     Attribute to compare
 * @param ascending     true=ascending false=descending
 */
function sortChildrenAttr(id, attribute, ascending) {
    let options = $(`#${id}`).children();
    let arr = options.map(function (_, o) {
        return {t: parseInt(o.getAttribute(attribute)), inner: o, attr: o.attributes };
    }).get();

    arr.sort(function (o1, o2) {
        return (o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0);
    });

    $(`#${id}`).children().remove();
    options.each(function (i, o) {
        let t = i;
        if (!ascending) t=options.length-1-t;
        $(`#${id}`).append(arr[t].inner)
    })
}

function hideNoResult(id) {
    if (id===undefined) id="notFound"
    $(`#${id}`).addClass("display-none")
}

function showNoResult(title, description, id) {
    if (id===undefined) id="notFound"

    $(`#${id}`).removeClass("display-none")
    $(`#${id}Text`).text(title)
    $(`#${id}Description`).text(description)
}