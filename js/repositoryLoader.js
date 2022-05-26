$(async function () {
    // send repoimg list request to github RESTApi
    const response = await fetch('https://api.github.com/users/parcivad/repos', {
        method: 'GET',
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    // decode to object
    const repos = await response.json();
    // loop through each repo and add it as product
    repos.forEach(repo => {
        console.log(repo);
        // show no forked repos
        if (repo.fork) return;
        // ignored repos
        if ( repo.name === "parcivad" || repo.name === "img" || repo.name === "ips-scene-manager") return;
        // format last update time
        let lastUpdated = new Date(repo.updated_at);
        // create card
        let alternativeImg = '"/img/products/repoimg/none.svg"';
        let htmlElement = '<div class="card mx-1 mt-2">\n' +
            '                <div class="text-center pt-2">\n' +
            '                    <img src="/img/products/repoimg/'+ repo.name +'.svg" alt="img loading failed">'+
            '                </div>\n' +
            '                <div class="card-body">\n' +
            '                    <h5 class="card-title">'+ repo.name +'</h5>\n' +
            '                    <p class="card-text">\n' +
            '                        '+ repo.description +' ' +
            '                    </p>\n' +' ' +
            '                    <a class="custom-link" href="'+ repo.html_url +'">' +
            '                        [view on Github]' +
            '                    </a>' +
            '                    <p class="card-subtitle">last updated on '+ (lastUpdated.getUTCDate()+1) +'.'+ (lastUpdated.getUTCMonth()+1) + '.' + lastUpdated.getFullYear() +'</p>\n' +
            '                </div>\n' +
            '            </div>'
        // add to cardholder
        $("#cardholder").append(htmlElement);
    });
    // remove spinner
    $("#spinner").remove();
});