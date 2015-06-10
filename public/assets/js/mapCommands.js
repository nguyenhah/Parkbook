/**
 * Map Pointers
 */
$(document).ready(function(){
    var map = new GMaps({
        el: '#pointers_map',
        lat: 51.5073346,
        lng: -0.1276831,
        zoom: 13,
        zoomControl : true,
        zoomControlOpt: {
            style : 'SMALL',
            position: 'TOP_LEFT'
        },
        panControl : false,
    });

    //Add markers, loop through this to add pins
    map.addMarker({
        lat: 51.503324,
        lng: -0.119543,
        title: 'London Eye',
        infoWindow: {
            content: '<p>The London Eye is a giant Ferris wheel situated on the banks of the River Thames in London, England. The entire structure is 135 metres (443 ft) tall and the wheel has a diameter of 120 metres (394 ft).</p>' }
    });

    //Set the middle of the map to your geoLocation
    //GMaps.geolocate({
    //    success: function(position){
    //        map.setCenter(position.coords.latitude, position.coords.longitude);
    //
    //        map.addMarker({
    //            lat: position.coords.latitude,
    //            lng: position.coords.longitude,
    //            title: 'You are here.',
    //            infoWindow: {
    //                content: '<p>You are here!</p>'
    //            }
    //        });
    //    },
    //    error: function(error){
    //        alert('Geolocation failed: '+error.message);
    //    },
    //    not_supported: function(){
    //        alert("Your browser does not support geolocation");
    //    }
    //});

    //This is the travel to Position, set it to park destination
    GMaps.geolocate({
        success: function(position){
            map.setCenter(position.coords.latitude, position.coords.longitude);
            map.drawRoute({
                origin: [position.coords.latitude, position.coords.longitude],
                destination: [51.5073346, -0.1276831],
                travelMode: 'driving',
                strokeColor: '#000',
                strokeOpacity: 0.6,
                strokeWeight: 6
            });
        },
        error: function(error){
            alert('Geolocation failed: '+error.message);
        },
        not_supported: function(){
            alert("Your browser does not support geolocation");
        }
    });
});