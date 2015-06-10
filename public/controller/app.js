/**
 * Created by vincentchan on 15-06-10.
 */
var dummy = angular.module("dummy", []);

dummy.controller("AppCtrl", function ($http) {
    var app = this;
    $http.get("http://localhost:3000").success(function (products) {
        app.products = products;
    })
})