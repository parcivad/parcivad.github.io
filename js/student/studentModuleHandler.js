// trigger function on load
loadModuleFromUrl();

/**
 * Finds t parameter in url and triggers the loadModule function
 */
function loadModuleFromUrl() {
    animateLoadByType("contentView", "100%", "dots");
    let moduleName = new URLSearchParams(window.location.search).get("t");
    if (moduleName === null) return;

    fetch(`/student/home/modules/${moduleName}.html`)
        .then(response=> response.text())
        .then(text=> {
            document.getElementById('contentView').innerHTML = text

            // remove old script
            document.getElementById("moduleScript").remove();

            let newscript = document.createElement("script");
            newscript.text = text.split('<script id="moduleScript">')[1].replace("</script>", "");
            newscript.id = "moduleScript";
            document.head.appendChild(newscript);

            // new script has to animateStop
        })
        .catch(error => {
            console.debug(error)
            animateError("contentView");
        });
}

/**
 * Loads .html module into contentView
 * @param moduleName
 */
function loadModule(moduleName) {
    let params = new URLSearchParams(window.location.search);
    params.delete("t");
    params.set("t", moduleName);
    //window.location.search = params.toString();

    try {
        clearInterval(intervalRefresh);
    } catch (exception) {
        // nothing to do :)
    }

    let url = window.location.origin+window.location.pathname+"?"+params.toString();
    window.history.pushState({}, '', url)
    loadModuleFromUrl();
}
