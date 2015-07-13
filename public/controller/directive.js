/**
 * Created by yves on 10/07/15.
 */

var parkbook = angular.module("parkbook");
//We can make this a new JS by specifying it as a directive
// Adding new directive for ngEnter
parkbook.directive('dynFbCommentBox', function () {
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            element[0].dataset.href = document.location.href;
            return typeof FB !== "undefined" && FB !== null ? FB.XFBML.parse(element.parent()[0]) : void 0;
        }
    };
    });

//We can make this a new JS by specifying it as a directive
// Adding new directive for ngEnter
parkbook.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});




