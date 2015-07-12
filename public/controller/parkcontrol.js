/**
 * Created by yves on 03/07/15.
 */

var parkcontrol = angular.module("parkbook");

parkcontrol.controller("ParkCtrl", ['$scope','$http','$stateParams','park', function ($scope, $http, $stateParams , park) {
    console.log(park);
    var parkInfo = park.data[0];
    $scope.name = parkInfo.name;
    $scope.address = parkInfo.streetNumber + " " + parkInfo.streetName;


    var prev_infowindow =false;
    var pos;
    var latitude;
    var longitude;
    var parkCenter;
    // Try HTML5 geolocation
    function checkLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                pos = new google.maps.LatLng(position.coords.latitude,
                    position.coords.longitude);
                parkCenter = new google.maps.LatLng(parkInfo.lat,
                    parkInfo.lon);

                //var infowindow = new google.maps.InfoWindow({
                //    map: $scope.mymap2,
                //    position: pos,
                //    content: 'Your Location'
                //});

                //$scope.mymap2.setCenter(parkCenter);


            }, function () {
                handleNoGeolocation(true);
            });
        } else {
            // Browser doesn't support Geolocation
            handleNoGeolocation(false);
        }
    }


    function loadPark() {
        var mapOptions = {
            zoom: 12,
            center: new google.maps.LatLng(49.246292, -123.116226),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.mymap2 = new google.maps.Map(document.getElementById('map-park-page'), mapOptions);
        //google.maps.event.addDomListener(window, 'load', initialize);
        //google.maps.event.addDomListener(window, "resize", function() {
        //    var center = $scope.mymap2.getCenter();
        //    google.maps.event.trigger($scope.mymap2, "resize");
        //    $scope.mymap2.setCenter(center);
        //});

        google.maps.event.addDomListener(window, 'load', loadPark);
        checkLocation();
        setMarker();
        $scope.mymap2.panTo(parkCenter);
    }

    loadPark();


    /*
     Geolocation error handler
     */
    function handleNoGeolocation(errorFlag) {
        if (errorFlag) {
            var content = 'Error: The Geolocation service failed.';
        } else {
            var content = 'Error: Your browser doesn\'t support geolocation.';
        }

        var options = {
            map: $scope.mymap2,
            position: new google.maps.LatLng(49.246292, -123.116226),
            content: content
        };

        var infowindow = new google.maps.InfoWindow(options);
        map.setCenter(options.position);
    }

    //Make Info windows for Maps
    function makeInfoWindow(map, infowindow, marker) {
        return function() {
            if( prev_infowindow ) {
                prev_infowindow.close();
            }
            prev_infowindow = infowindow;
            infowindow.open(map, marker)
        };
    }

    //Make the markers for maps
    function setMarker() {
        var infowindow;
        var marker;

        var contentString = '<p><b>' + parkInfo.name + '</b></p>' +
            '<p>' + parkInfo.streetNumber + " " + parkInfo.streetName + '</p>' +
            '<p>"Click on the pin to go here!"</p>';

        parkCenter = new google.maps.LatLng(parkInfo.lat,
            parkInfo.lon);

        var infowindow = new google.maps.InfoWindow({content: contentString});

        marker = new google.maps.Marker({

            map: $scope.mymap2,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(parkInfo.lat, parkInfo.lon),
            title: parkInfo.name
        });

        google.maps.event.addListener(marker, "click", function () {
            latitude = this.position.lat();
            longitude = this.position.lng();
            //alert(this.position);
            console.log(latitude);
            console.log(longitude);
            console.log(pos);
            var infowindow = new google.maps.InfoWindow({
                map: $scope.mymap2,
                position: pos,
                content: 'Your Location'
            });
            calcRoute();
        }); //end addListener

        //google.maps.event.addListener(marker, 'click', makeInfoWindow($scope.mymap2, infowindow, marker));
        infowindow.open($scope.mymap2, marker)
    }

    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();

    function calcRoute() {
        directionsDisplay.setMap($scope.mymap2);
        var h2 = new google.maps.LatLng(parkInfo.lat, parkInfo.lon);
        console.log(h2);
        var request = {
            origin:pos,
            destination:h2,
            travelMode: google.maps.TravelMode.WALKING
        };
        directionsService.route(request, function(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(result);
            }
        });
    }

}]);
