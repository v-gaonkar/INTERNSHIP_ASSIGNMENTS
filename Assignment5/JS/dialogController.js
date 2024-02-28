angular.module('movieSearch.dialogController', [])
.controller('DialogController', ['$mdDialog', '$scope', 'selectedMovie', function($mdDialog, $scope, selectedMovie) {
    var dialogCtrl = this;
    
    dialogCtrl.selectedMovie = angular.copy(selectedMovie);
    var originalMovie = angular.copy(selectedMovie);

    dialogCtrl.resetChanges = function () {
        dialogCtrl.selectedMovie = angular.copy(selectedMovie);
    };

    dialogCtrl.userRating = selectedMovie.rating;

    dialogCtrl.toggleStar = function (rating) {
        var imdbRating = rating * 2;
        dialogCtrl.selectedMovie.rating = rating;
        for (var i = 1; i <= 5; i++) {
            dialogCtrl['star' + i] = i <= rating; 
        }
        updateLocalStorage('imdbRating', imdbRating);
    };
    
    dialogCtrl.saveChanges = function () {
        angular.forEach(dialogCtrl.selectedMovie, function (value, key) {
            if (value !== originalMovie[key]) {
                updateLocalStorage(key, value);
            }
        });
        $mdDialog.hide();
    };

    dialogCtrl.closeDialog = function () {
        $mdDialog.hide();
    };

    dialogCtrl.mapRating = function () {
        if (!dialogCtrl.selectedMovie || !dialogCtrl.selectedMovie.imdbRating) {
            return 0;
        }

        var rating = parseFloat(dialogCtrl.selectedMovie.imdbRating);
        return Math.round(rating / 2);
    };

    dialogCtrl.init = function() {
        var rating = dialogCtrl.mapRating();
        dialogCtrl.toggleStar(rating);
    };

    dialogCtrl.init();

    function updateLocalStorage(fieldName, fieldValue) {
        try {
            var storedMovie = localStorage.getItem('searchedMovie_' + dialogCtrl.selectedMovie.Title);
            if (storedMovie) {
                var movie = JSON.parse(storedMovie);
                movie[fieldName] = fieldValue;
                localStorage.setItem('searchedMovie_' + dialogCtrl.selectedMovie.Title, JSON.stringify(movie));
                console.log(fieldName + " updated successfully");
            } else {
                console.error("Movie not found in local storage");
            }
        } catch (error) {
            console.error("Error updating local storage:", error);
        }
    }
}]);
