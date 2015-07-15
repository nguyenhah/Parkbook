/**
 * Created by yves on 09/07/15.
 */


var homecontrol = angular.module("parkbook");

homecontrol.controller("AppCtrl", ['$scope', '$http', 'ezfb', function ($scope, $http, ezfb) {
    var url = "http://localhost:3000";
    // url = "https://parkbook.herokuapp.com";

    $scope.savePark = function(newPark) {
        $http.post(url + "/add", {name:newPark}).success(function() {
            loadParks();
        })
    };

    updateLoginStatus(updateApiMe);

    $scope.login = function () {
        /**
         * Calling FB.login with required permissions specified
         * https://developers.facebook.com/docs/reference/javascript/FB.login/v2.0
         */
        ezfb.login(function (res) {
            /**
             * no manual $scope.$apply, I got that handled
             */
            if (res.authResponse) {
                updateLoginStatus(updateApiMe);
            }
        }, {scope: 'email,user_likes'});
    };

    $scope.logout = function () {
        /**
         * Calling FB.logout
         * https://developers.facebook.com/docs/reference/javascript/FB.logout
         */
        ezfb.logout(function () {
            updateLoginStatus(updateApiMe);
        });
    };

    $scope.share = function () {
        ezfb.ui(
            {
                method: 'feed',
                name: 'ParkBook, better than Park Place',
                picture: 'http://plnkr.co/img/plunker.png',
                link: 'https://parkbook.herokuapp.com',
                description: 'Parkbook is great to look at parks from vancouver' +
                ' Please try it and feel free to give feedbacks.'
            },
            function (res) {
                // res: FB.ui response
            }
        );
    };

    /**
     * For generating better looking JSON results
     */
    var autoToJSON = ['loginStatus', 'apiMe'];
    angular.forEach(autoToJSON, function (varName) {
        $scope.$watch(varName, function (val) {
            $scope[varName + 'JSON'] = JSON.stringify(val, null, 2);
        }, true);
    });

    /**
     * Update loginStatus result
     */
    function updateLoginStatus (more) {
        ezfb.getLoginStatus(function (res) {
            $scope.loginStatus = res;

            (more || angular.noop)();
        });
    }

    /**
     * Update api('/me') result
     */
    function updateApiMe () {
        ezfb.api('/me', function (res) {
            $scope.apiMe = res;
        });
    }


    // Try HTML5 geolocation
    function checkLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                pos = new google.maps.LatLng(position.coords.latitude,
                    position.coords.longitude);

                var infowindow = new google.maps.InfoWindow({
                    map: $scope.mymap,
                    position: pos,
                    content: 'Your Location'
                });

                $scope.mymap.setCenter(pos);


            }, function () {
                handleNoGeolocation(true);
            });
        } else {
            // Browser doesn't support Geolocation
            handleNoGeolocation(false);
        }
    }


    function loadParks() {
        $http.get(url + "/home").success(function (parks) {
            $scope.parks = parks;

            var mapOptions = {
                zoom: 12,
                center: new google.maps.LatLng(49.246292, -123.116226),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            $scope.mymap = new google.maps.Map(document.getElementById('map'), mapOptions);

            google.maps.event.addDomListener(window, 'load', loadParks);
            checkLocation();
        })
    }

    loadParks();

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
            map: map,
            position: new google.maps.LatLng(49.246292, -123.116226),
            content: content
        };

        var infowindow = new google.maps.InfoWindow(options);
        map.setCenter(options.position);
    }




    //this function is called inside HTML
    //the http call is tagged with "/download" and sent to server.js
    //server.js calls the app.get() with the "/download" tag
    $scope.importParks = function() {
        console.log("clicked import");
        $http.get(url + "/download").success(function() {
            console.log("inside success");
            loadParks();
        })

    };

    var prev_infowindow =false;
    var pos;
    var markersArray = [];
    var latitude;
    var longitude;
    function clearOverlays() {
        for (var i = 0; i < markersArray.length; i++) {
            markersArray[i].setMap(null);
        }
        markersArray.length = 0;
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
    function setMarkers(parkObjects) {
        for (var i = 0; i < parkObjects.length; i++) {

            var infowindow = [];
            var marker = [];

            var contentString = '<p><b>' + parkObjects[i].name + '</b></p>' +
                '<p>' + parkObjects[i].streetNumber + " " + parkObjects[i].streetName + '</p>' +
                '<p><a href="#/park/' + parkObjects[i].name + '">' + "View this park!" +'</a></p>';

            infowindow[i] = new google.maps.InfoWindow({content: contentString});

            marker[i] = new google.maps.Marker({

                map: $scope.mymap,
                animation: google.maps.Animation.DROP,
                position: new google.maps.LatLng(parkObjects[i].lat, parkObjects[i].lon),
                title: parkObjects[i].name
            });

            google.maps.event.addListener(marker[i], "click", function () {
                latitude = this.position.lat();
                longitude = this.position.lng();
                //alert(this.position);
                console.log(latitude);
                console.log(longitude);
                console.log(pos);
                calcRoute();
            }); //end addListener

            google.maps.event.addListener(marker[i], 'click', makeInfoWindow($scope.mymap, infowindow[i], marker[i]));
            markersArray.push(marker[i]);
        }
    }

    //Find parks based on the user's search
    $scope.findPark = function(parkName) {
        clearOverlays();
        console.log(parkName);
        $http.post(url + "/search" + parkName, {name: parkName}).success(function(park) {

            //if (park.length == 0) {
            //    alert("Sorry! We couldn't find a park named " + parkName);
            //    return;
            //}

            $scope.parksSearched = park;

            try {
                setMarkers(park);
                $scope.mymap.panTo(markersArray[0].getPosition());
            } catch(err) {
                alert("Sorry! We couldn't find a park named " + parkName);
            }

        })
    };

    $scope.findAllParks = function() {
        $http.get(url + "/searchall");
    };

    $scope.findRandomPark = function() {
        $http.post(url + "/adventure", {name: "Arbutus Village Park"}).success(function(parks) {
            clearOverlays();

            $scope.allParks = parks;
            var randNum = Math.floor((Math.random() * parks.length - 1));
            var randPark = [parks[randNum]];
            $scope.parksSearched = randPark;

            setMarkers(randPark);
            $scope.mymap.panTo(markersArray[0].getPosition());

        });
    };

    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();


    function calcRoute() {
        directionsDisplay.setMap($scope.mymap);
        var h2 = new google.maps.LatLng(latitude, longitude);
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

    $scope.goToPark = function(parkID) {
        console.log("going to park");
        $http.get(url + "/views/park.html", {_id:parkID}).success(function() {
            console.log("inside success of go to park");
        })
    };

}]);