// Google Map-Initialize
var map;
var markers = [];
var infoWindows = [];
function initMap() {

    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat:28.592181, lng:77.219193},
        zoom: 15,
        disableDefaultUI:true
    });

}
