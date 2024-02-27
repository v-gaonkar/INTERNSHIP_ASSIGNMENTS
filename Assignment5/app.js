var myApp = angular.module("movieSearch", ['ngMaterial']);

myApp.controller('ToggleList', function ($scope, $mdSidenav) {
    $scope.toggleLeft = buildToggler('left');

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }
});

myApp.controller('MovieController', function ($http, $mdDialog) {
    var ctrl = this;

    ctrl.genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'];
    ctrl.selectedGenre = 'ALL';
    ctrl.searchText = '';
    ctrl.movies = []; // Array to store all movies
    ctrl.filteredMovies = []; // Array to store filtered movies

    // Load movies from local storage on initialization
    ctrl.loadMovies = function() {
        var storedMovies = localStorage.getItem('movies');
        ctrl.movies = storedMovies ? JSON.parse(storedMovies) : [];
        // Set filteredMovies to movies on load to display all initially
        ctrl.filteredMovies = ctrl.movies;
    };

    ctrl.selectGenre = function (genre) {
        ctrl.selectedGenre = genre;
    };

    // Call loadMovies on controller initialization
    ctrl.loadMovies();

    ctrl.searchMovie = function () {
        // Check if movie data is available in local storage
        var storedMovie = localStorage.getItem('searchedMovie_' + ctrl.searchText);

        if (storedMovie) {
            // If movie data is found in local storage, parse and display it
            console.log('Movie data fetched from local storage:', storedMovie);
            ctrl.movie = JSON.parse(storedMovie);
            ctrl.dataSource = 'Local Storage'; // Flag indicating the source of the data

            // Filter movies based on selected genre
            ctrl.filteredMovies = ctrl.movies.filter(function(movie) {
                return movie.Genre && movie.Genre.toLowerCase().includes(ctrl.selectedGenre.toLowerCase());
            });
        } else {
            // If movie data is not found in local storage, make an API call
            $http.get('http://www.omdbapi.com/?apikey=f5b4a719&t=' + ctrl.searchText)
            .then(function (response) {
                console.log('Success! Response from API:', response.data);
                ctrl.movie = response.data;
                // Store fetched movie data in local storage
                localStorage.setItem('searchedMovie_' + ctrl.searchText, JSON.stringify(response.data));
                ctrl.dataSource = 'API'; // Flag indicating the source of the data
                // Filter movies based on selected genre
                ctrl.filteredMovies = ctrl.movies.filter(function(movie) {
                    return movie.Genre && movie.Genre.toLowerCase().includes(ctrl.selectedGenre.toLowerCase());
                });
            })
            .catch(function (error) {
                console.error('Error fetching movie details:', error);
                // Log the error to the console
            });
        }
    };

    for (var key in localStorage) {
        if (key.startsWith('searchedMovie_')) {
            ctrl.movies.push(JSON.parse(localStorage.getItem(key)));
        }
    }

    // Set filteredMovies to all movies initially
    ctrl.filteredMovies = ctrl.movies;

    ctrl.mapRating = function () {
        if (!ctrl.movie || !ctrl.movie.imdbRating) {
            return 0; // Default to 0 if movie or IMDb rating is not available
        }

        // IMDb rating is out of 10, so we map it to a 5 scale
        var rating = parseFloat(ctrl.movie.imdbRating);
        return Math.round((rating / 2) * 10) / 10; // Map to 5 scale with one decimal point
    };

    ctrl.showDialog = function(movie) {
        ctrl.selectedMovie = angular.copy(movie);

        $mdDialog.show({
            controller: 'DialogController',
            controllerAs: 'dialogCtrl',
            templateUrl: 'Edit_Details.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                selectedMovie: ctrl.selectedMovie
            }
        });
    };
});

myApp.controller('DialogController', ['$mdDialog', '$scope', 'selectedMovie', function($mdDialog, $scope, selectedMovie) {
    var dialogCtrl = this;
    dialogCtrl.selectedMovie = angular.copy(selectedMovie); // Keep a copy of the original movie data
    var originalMovie = angular.copy(selectedMovie); // Keep a copy of the original movie data

    dialogCtrl.resetChanges = function() {
        // Reset the edited data back to its original values
        dialogCtrl.selectedMovie = angular.copy(selectedMovie);
    };

    dialogCtrl.userRating = selectedMovie.rating;

    // Number of initially editable stars (corresponding to the initial rating)
    dialogCtrl.editableStars = selectedMovie.rating;

    // Function to toggle star state
    dialogCtrl.toggleStar = function(rating) {
        dialogCtrl.userRating = rating;
        dialogCtrl.editableStars = rating;
    };
    // Watch for changes in selectedMovie and update local storage
    dialogCtrl.saveChanges = function() {

        // Update local storage for each field that has changed
        angular.forEach(dialogCtrl.selectedMovie, function(value, key) {
            if (value !== originalMovie[key]) {
                updateLocalStorage(key, value);
            }
        });
        $mdDialog.hide();
    };
    dialogCtrl.cancel = function() {
        $mdDialog.cancel();
    };


    function updateLocalStorage(fieldName, fieldValue) {
        try {
            // Get the current movie object from local storage
            var storedMovie = localStorage.getItem('searchedMovie_' + dialogCtrl.selectedMovie.Title);
            if (storedMovie) {
                // Parse the stored movie object
                var movie = JSON.parse(storedMovie);
                // Update the specific field
                movie[fieldName] = fieldValue;
                // Update local storage with the updated movie object
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
