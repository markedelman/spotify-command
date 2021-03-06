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


var artist;
var getArtist = function(name) {
    // Edit me!
    var query = {
        q: name,
        limit: 1,
        type: 'artist'
    };

    let promise =  getFromApi('search', query).then((item) => {
        artist = item.artists.items[0];
        return artist;
    });
    return promise;
};
