angular.module('devKittens')

.directive('headerDirective', function () {
	return {
		restrict: 'E',
		scope: true,
		templateUrl: '/public/templates/header.html',
		link: function (scope, elem, attrs) {
			document.body.scrollTop = document.documentElement.scrollTop = 0;

			scope.openHeaderDropdown = false;
			scope.toggleHeaderDropdown = function () {
				scope.openHeaderDropdown = !scope.openHeaderDropdown;
			}
		}
	}
})