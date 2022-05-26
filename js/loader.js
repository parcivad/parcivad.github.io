$(function () {
    // header
    fetch('/modules/header.html')
        .then(response=> response.text())
        .then(text=> document.getElementById('header').innerHTML = text);
    // header
    fetch('/modules/footer.html')
        .then(response=> response.text())
        .then(text=> document.getElementById('footer').innerHTML = text);
});