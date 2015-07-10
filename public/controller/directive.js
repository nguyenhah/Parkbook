/**
 * Created by yves on 10/07/15.
 */

var parkbook = angular.module("parkbook");
//We can make this a new JS by specifying it as a directive
// Adding new directive for ngEnter
parkbook.directive('dynFbCommentBox', function () {
    function createHTML(href, numposts, colorscheme) {
        return '<div class="fb-comments" ' +
            'data-href="' + href + '" ' +
            'data-numposts="' + numposts + '" ' +
            'data-colorsheme="' + colorscheme + '">' +
            '</div>';
    }

    return {
        restrict: 'A',
        scope: {},
        link: function postLink(scope, elem, attrs) {
            attrs.$observe('pageHref', function (newValue) {
                var href        = newValue;
                var numposts    = attrs.numposts    || 5;
                var colorscheme = attrs.colorscheme || 'light';

                elem.html(createHTML(href, numposts, colorscheme));
                FB.XFBML.parse(elem[0]);
            });
        }
    };
});




