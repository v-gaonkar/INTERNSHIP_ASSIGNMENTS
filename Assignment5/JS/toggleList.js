angular.module('movieSearch.toggleList', [])
.controller('ToggleList', ['$scope', function ($mdSidenav) {
    var vm = this;
    vm.toggleLeft = buildToggler('left');

    function buildToggler(componentId) {
        return function() {
            $mdSidenav(componentId).toggle();
        };
    }
}]);
