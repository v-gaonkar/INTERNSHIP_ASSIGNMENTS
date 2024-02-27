angular.module('movieSearch.toggleList', [])
.controller('ToggleList', ['$scope', '$mdSidenav', '$mdMedia', function ($scope, $mdSidenav, $mdMedia) {
    $scope.isSidenavLockedOpen = function() {
        return $mdMedia('gt-sm') && $mdSidenav('left').isLockedOpen();
    };
    $scope.toggleLeft = function() {
        $mdSidenav('left').toggle();
    };
}]);
