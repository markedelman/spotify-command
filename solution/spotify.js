var getFromApi = function(endpoint, query) {
    var url = 'https://api.spotify.com/v1/' + endpoint;
    var queryString = Qs.stringify(query);
    if (queryString) {
        url += '?' + queryString;
    };

    return fetch(url).then(function(response) {
        if (response.status < 200 || response.status >= 300) {
            return Promise.reject(response.statusText);
        }
        return response.json();
    });
};
let artist;
let getArtist = (name) => {
    const query = {
        q: name,
        limit: 1,
        type: 'artist'
    };
    return getFromApi('search', query).then((item) => {
        artist = item.artists.items[0];
        return getFromApi(`artists/${artist.id}/related-artists`);
    }).then((item) => {
        const query = {
            country: 'US'
        };
        artist.related = item.artists;
        var allPromise = artist.related.map((artist) =>
            getFromApi(`artists/${artist.id}/top-tracks`, query)
        );
        console.log(allPromise);
        var promises = Promise.all(allPromise);

        return promises.then(function(responses) {
            for (let i = 0; i < responses.length; i++) {
                artist.related[i].tracks = responses[i].tracks;
            }
            return artist;
        });
    }).catch((error) => {
        console.log(error);
    });
};
