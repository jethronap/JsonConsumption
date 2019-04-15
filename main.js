// this function shows a map:
function openMap(options) {

    if (options.zoom === undefined) {
        options.zoom = 4;
    };

    if (options.target === undefined) {
        options.target = 'map';
    };
    let map = new ol.Map({
        target: options.target,
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([options.lon, options.lat]),
            zoom: options.zoom
        })
    });
};

// this function populates the country info:
function showMapInfo(data) {
    document.querySelector("#info").innerHTML = `
                                                 <p>👅Name: ${data.name}</p>
                                                 <p>🚧Population: ${data.population}</p>
                                                 <p>💣Capital: ${data.capital}</p>
                                                 <p>🎉Lon: ${data.latlng[1]}</p>
                                                 <p>🎉Lat: ${data.latlng[0]}</p>`
}

// this function handles the 404 server response:
function handleErrors(response) {
    if (!response.ok) {
        document.querySelector("#map").innerHTML = `<p>Silly You, this is</p> 
                                                    <p>NOT a valid name</p> 
                                                    <p>for a country</p>`;
        document.querySelector("#info").innerHTML = "💔this is a no-go mate!"
        throw Error(response.statusText);
    }
    return response;
}

let $getInfoBtn = document.querySelector("#getinfo");
let $countryInput = document.querySelector("#countryname");

// this is where things happen:
function mapInfo() {

    let value = $countryInput.value;
    const endpoint = "https://restcountries.eu/rest/v2/name/";

    if (value.length > 0) {
        value = value.toLowerCase().trim();

        // empty the map before filling it with another one:
        document.querySelector("#map").innerHTML = "";

        // do a fetch request:
        fetch(endpoint + value)
            .then(handleErrors)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);

                if (data.length > 1) {
                    openMap({ lon: data[1].latlng[1], lat: data[1].latlng[0] });
                    showMapInfo(data[1]);

                } else {
                    openMap({ lon: data[0].latlng[1], lat: data[0].latlng[0] });
                    showMapInfo(data[0]);
                }
            })
            .catch(error => console.log(error));
    } else {
        console.log("give me something, mate...");
    }
}

$getInfoBtn.addEventListener("click", mapInfo);
// this is where enter works like getInfoBtn:
document.querySelector('#country')
    .addEventListener("submit", (event) => { event.preventDefault(); mapInfo() });

