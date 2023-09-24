// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var map, infoWindow;

const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);

var width = parseFloat(urlParams.get("width"));
var space = parseFloat(urlParams.get("space"));
var length = parseFloat(urlParams.get("length"));
var latA = parseFloat(urlParams.get("latA"));
var lngA = parseFloat(urlParams.get("lngA"));
var latB = parseFloat(urlParams.get("latB"));
var lngB = parseFloat(urlParams.get("lngB"));
var headingAB;
    var pointC;
    var pointA;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: latB, lng: lngB },
        zoom: 19,
        tilt: 47.5,
        heading: 320,
        mapTypeId: "satellite",
    });
   
    var posMap;
    google.maps.event.addListener(map, "bounds_changed", function() {
        console.log("map bounds{"+map.getCenter());
        

        console.log(posMap);
        if(posMap == undefined){

        }else{
            console.log(google.maps.geometry.spherical.computeDistanceBetween (posMap, map.getCenter()));
        }
        posMap = map.getCenter();

     });

    // define B at distance "length" to define the entire reference line
    var headingAB = google.maps.geometry.spherical.computeHeading({ lat: latA, lng: lngA }, { lat: latB, lng: lngB });
    var pointC = google.maps.geometry.spherical.computeOffset({ lat: latA, lng: lngA }, length, headingAB);
    var pointA = google.maps.geometry.spherical.computeOffset({ lat: latA, lng: lngA }, length, headingAB+180);

    const lineABCoordinates = [
        pointA,
        pointC,
    ];

    // draw 100 lines, I am sure it is enough for any field I have to work in
    for (var i = -100; i < 100; i++) {
        var posicion1_a = google.maps.geometry.spherical.computeOffset( pointA, space*i, headingAB + 90);
        var posicion1_b = google.maps.geometry.spherical.computeOffset(pointC, space*i, headingAB + 90);

        const flightPlanCoordinates2 = [
            { lat: posicion1_a.lat(), lng: posicion1_a.lng() },
            { lat: posicion1_b.lat(), lng: posicion1_b.lng() },
        ];
        const flightPath2 = new google.maps.Polyline({
            path: flightPlanCoordinates2,
            geodesic: true,
            strokeColor: "#0000FF",
            strokeOpacity: 1.0,
            strokeWeight: 2,
        });

        flightPath2.setMap(map);
    }

    const lineAB = new google.maps.Polyline({
        path: lineABCoordinates,
        geodesic: true,
        strokeColor: "#00FF00",
        strokeOpacity: 1.0,
        strokeWeight: 2,
    });

    lineAB.setMap(map);
    map.setHeading(headingAB);

    infoWindow = new google.maps.InfoWindow();

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                const cityCircle = new google.maps.Circle({
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#FF0000",
                    fillOpacity: 0.2,
                    map,
                    center: pos,
                    radius: width/2,
                });
                map.setCenter(pos);
                cityCircle.setMap(map);
            },
            () => {
                handleLocationError(true, infoWindow, map.getCenter());
            },
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }    
}

setInterval(() => {
    console.log("position");
    navigator.geolocation.getCurrentPosition(showPosition);
}, (1500));

function showPosition(position){
    const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
    };
    const cityCircle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.2,
        map,
        center: pos,
        radius: width/2,
    });
    map.setCenter(pos); 
    cityCircle.setMap(map);   
}

const watchID = navigator.geolocation.watchPosition((position) => {
    console.log("position");
    const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
    };
    const cityCircle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.2,
        map,
        center: pos,
        radius: width/2,
    });
    map.setCenter(pos);
    cityCircle.setMap(map);
});

window.initMap = initMap;


