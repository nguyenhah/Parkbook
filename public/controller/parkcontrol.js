/**
 * Created by yves on 03/07/15.
 */

var parkcontrol = angular.module("parkbook");


var parkInfo;
var fbid;
parkcontrol.controller("ParkCtrl", ['$scope','$http','$stateParams','park','$location', 'myService', 'admin', function ($scope, $http, $stateParams , park, $location, myService, admin) {
    parkInfo = park.data[0];
    $scope.name = parkInfo.name;
    $scope.address = parkInfo.streetNumber + " " + parkInfo.streetName;
    $scope.facilityTypes = parkInfo.facilityType;
    $scope.washroomLocations = parkInfo.washroomLocation;
    $scope.features = parkInfo.features;

    try {
        fbid = admin.authResponse.userID;
    } catch (err) {
        fbid = -1;
    }

    getAverage($scope, myService);
    $scope.rating1 = {};
    $scope.isReadonly = true;

    /*
    Updates rating selected
     */
    $scope.rateFunction = function(rating) {
        console.log("Rating selected: " + rating);
    };


    /*
     Returns an average rating of stars for a given park
     */
    function getAverage($scope, myService) {
        var myDataPromise = myService.getData($scope.name);
        myDataPromise.then(function(result) {  // this is only run after $http completes
            $scope.data = result;
            var sum = 0;
            try {
                for (var i = 0; i < result[0].rating.length; i++) {
                    sum += result[0].rating[i];
                }
                sum = sum / result[0].rating.length;

                $scope.rating1 = sum;
            } catch (err) {
                $scope.rating1 = "No ratings yet";
            }
        });
    }


    var prev_infowindow =false;
    var pos;
    var latitude;
    var longitude;
    var parkCenter;
    /*
     Check if geolocation is supported by the browser
     */
    function checkLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                pos = new google.maps.LatLng(position.coords.latitude,
                    position.coords.longitude);
                parkCenter = new google.maps.LatLng(parkInfo.lat,
                    parkInfo.lon);

            }, function () {
                handleNoGeolocation(true);
            });
        } else {
            // Browser doesn't support Geolocation
            handleNoGeolocation(false);
        }
    }


    /*
    Display the map of the current park
     */
    function loadPark() {
        var mapOptions = {
            zoom: 12,
            scrollwheel: false,
            center: new google.maps.LatLng(49.246292, -123.116226),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.mymap2 = new google.maps.Map(document.getElementById('map-park-page'), mapOptions);

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

        var contentString = '<center><p><b>' + parkInfo.name + '</b></p>' +
            '<p>' + parkInfo.streetNumber + " " + parkInfo.streetName + '</p>' +
            '<p>"Click on the pin to go here!"</p></center>';

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

    /*
    Calculate the distance from the current location to the park
     */
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

    /*
    Return the current url address
     */
    $scope.getLocation = function() {
        return $location.absUrl();
    }
}]);

/*
Directive for the rating system
 */
parkcontrol.directive("starRating", function($http) {
    return {
        restrict : "EA",
        template : "<ul class='rating' ng-class='{readonly: readonly}'>" +
        "  <li ng-repeat='star in stars' ng-class='star' ng-click='toggle($index)'>" +
        "    <i class='fa fa-star'></i>" + //&#9733
        "  </li>" +
        "</ul>",
        scope : {
            ratingValue : "=ngModel",
            max : "=?", //optional: default is 5
            onRatingSelected : "&?",
            readonly: "=?"
        },
        link : function(scope, elem, attrs) {
            if (scope.max == undefined) { scope.max = 5; }
            function updateStars() {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled : i < scope.ratingValue
                    });
                }
            }
            scope.toggle = function(index) {
                if (scope.readonly == undefined || scope.readonly == false){
                    scope.ratingValue = index + 1;
                    scope.onRatingSelected({rating: index + 1});
                    console.log(fbid);
                    if (fbid == -1) {
                        alert("Please login to rate!");
                    } else {
                        $http.get('/addRating/' + parkInfo.name + '/' + scope.ratingValue + '/' + fbid)
                            .success(function(res) {
                                if (res == true) {
                                    console.log("in addrating");
                                    console.log(res);
                                    alert("You have already rated this park!");
                                }
                            });
                    }
                }
            };
            scope.$watch("ratingValue", function(oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    };
});