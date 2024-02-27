angular.module('movieSearch.toggleList', [])
.controller('ToggleList', ['$scope', '$mdSidenav', function($scope, $mdSidenav) {
    var vm = this;
    $scope.toggleLeft = buildToggler('left');

    function buildToggler(componentId) {
        return function() {
            $mdSidenav(componentId).toggle();
        };
    }
}]);
