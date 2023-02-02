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

            let newscript = document.createElement("script");
            newscript.text = text.split("<script>")[1].replace("</script>", "");
            document.head.appendChild(newscript);

            animateStop("contentView");
        })
        .catch(error => {
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
    window.location.search = params;
}
