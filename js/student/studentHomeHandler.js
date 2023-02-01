let canvas = false;

$(window).resize(function () {
    if($(window).width() < 720) {
        if (canvas) return true;
        startCanvas()
        canvas = true;
        return true;
    }
    if (!canvas) return true;
    stopCanvas()
    canvas = false;
    return true;
});

function startCanvas() {
    $("#sideBarView")
        .addClass("offcanvas")
        .addClass("offcanvas-start")
    $("#sideBarToggle")
        .removeClass("display-none");
    themeChange()
}

function stopCanvas() {
    $("#sideBarView")
        .removeClass("offcanvas")
        .removeClass("offcanvas-start")
        .removeClass("show")
        .removeAttr("aria-hidden")
        .removeAttr("style")
    $("#sideBarToggle").addClass("display-none")
    $(".offcanvas-backdrop").remove()
    themeChange()
}

wr();
function wr() {
    if($(window).width() < 720) {
        if (canvas) return;
        startCanvas()
        canvas = true;
        return;
    }
    if (!canvas) return;
    stopCanvas()
    canvas = false;
    return;
}

// on start
themeChange()

// on offcanvas close
const myOffcanvas = document.getElementById('sideBarView')
myOffcanvas.addEventListener('hidden.bs.offcanvas', event => {
    themeChange();
})

// change theme to sideBar or Content
function themeChange() {
    if ($("#sideBarView").hasClass("offcanvas")) {
        if ($("#sideBarView").hasClass("show")) {
            document.querySelector('meta[media="(prefers-color-scheme: light)"]')?.setAttribute('content', "#e7e8ed");
            document.querySelector('meta[media="(prefers-color-scheme: dark)"]')?.setAttribute('content', "#000000");
        } else {
            document.querySelector('meta[media="(prefers-color-scheme: light)"]')?.setAttribute('content', "#ffffff");
            document.querySelector('meta[media="(prefers-color-scheme: dark)"]')?.setAttribute('content', "#0c0c0c");
        }
    } else {
        document.querySelector('meta[media="(prefers-color-scheme: light)"]')?.setAttribute('content', "#e7e8ed");
        document.querySelector('meta[media="(prefers-color-scheme: dark)"]')?.setAttribute('content', "#000000");
    }
}