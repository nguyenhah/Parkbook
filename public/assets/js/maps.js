/**
 * Created by vincentchan on 15-06-19.
 */

var markerCount = 0;
var map;

$(document).ready(function() {


    //function initialize() {
    //    var mapOptions = {
    //        center: {lat: -34.397, lng: 150.644},
    //        zoom: 8
    //    };
    //    var map = new google.maps.Map(document.getElementById('map-canvas'),
    //        mapOptions);
    //}
    //
    //google.maps.event.addDomListener(window, 'load', initialize);

    function initialize() {
        var myLatlng = new google.maps.LatLng(49.246292, -123.116226);
        var map_canvas = document.getElementById('map-canvas');
        var map_options = {
            center: myLatlng,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        map = new google.maps.Map(map_canvas, map_options);
    }

//When the window is loaded, run the initialize function to
//setup the map
    google.maps.event.addDomListener(window, 'load', initialize);


//This function will add a marker to the map each time it
//is called.  It takes latitude, longitude, and html markup
//for the content you want to appear in the info window
//for the marker.
    function addMarkerToMap(lat, long, htmlMarkupForInfoWindow){
        var infowindow = new google.maps.InfoWindow();
        var myLatLng = new google.maps.LatLng(lat, long);
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            animation: google.maps.Animation.DROP,
        });

        //Gives each marker an Id for the on click
        markerCount++;

        //Creates the event listener for clicking the marker
        //and places the marker on the map
        google.maps.event.addListener(marker, 'click', (function(marker, markerCount) {
            return function() {
                infowindow.setContent(htmlMarkupForInfoWindow);
                infowindow.open(map, marker);
            }
        })(marker, markerCount));

        //Pans map to the new location of the marker
        map.panTo(myLatLng)
    }


    $('#btnClick').click({lat: 49.246292, lon: -123.116226 }, addMark);

});

function addMark(event) {

    var iLatLng = new google.maps.LatLng(event.data.lat, event.data.lon);

    new google.maps.Marker({
        position: iLatLng,
        map: map
    })
}

