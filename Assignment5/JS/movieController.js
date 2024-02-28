angular.module('movieSearch.movieController', [])
.controller('MovieController', ['$http', '$mdDialog', function($http, $mdDialog) {
    var ctrl = this;

    ctrl.genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'];
    ctrl.selectedGenre = 'ALL';
    ctrl.searchText = '';
    ctrl.movies = [];
    ctrl.filteredMovies = [];

    ctrl.loadMovies = function () {
        var storedMovies = localStorage.getItem('movies');
        ctrl.movies = storedMovies ? JSON.parse(storedMovies) : [];
        ctrl.filteredMovies = ctrl.movies;
    };
    
    ctrl.loadMovies();

    ctrl.selectGenre = function (genre) {
    ctrl.selectedGenre = genre;
    if (genre === 'ALL') {
        ctrl.filteredMovies = ctrl.movies;
    } else {
        ctrl.filteredMovies = ctrl.movies.filter(function (movie) {
            var genreMatches = movie.Genre && movie.Genre.includes(genre);
            return genreMatches;
        });
    }
};

    ctrl.searchMovie = function () {
        var storedMovie = localStorage.getItem('searchedMovie_' + ctrl.searchText);
    
        if (storedMovie) {
            console.log('Movie data fetched from local storage:', storedMovie);
            ctrl.movie = JSON.parse(storedMovie);
            ctrl.dataSource = 'Local Storage';
    
            ctrl.filteredMovies = [ctrl.movie];
    
            if (ctrl.searchText) {
                console.log('Clearing genre filter');
                ctrl.selectedGenre = 'ALL';
            }
    
        } else {
            $http.get('http://www.omdbapi.com/?apikey=f5b4a719&t=' + ctrl.searchText)
                .then(function (response) {
                    console.log('Success! Response from API:', response.data);
                    if (response.data.Response === 'True') {
                        ctrl.movie = response.data;
                        ctrl.movie.rating = 0;
                        localStorage.setItem('searchedMovie_' + ctrl.searchText, JSON.stringify(response.data));
                        ctrl.filteredMovies = [ctrl.movie];
                        if (ctrl.searchText) {
                            console.log('Clearing genre filter');
                            ctrl.selectedGenre = 'ALL';
                        }
                    } else {
                        console.log('Movie not found:', response.data.Error);
                        alert('Movie not found: ' + response.data.Error);
                    }
                })
                .catch(function () {
                    alert('Error fetching movie details. Please try again later.');
                });
        }
    };    

    for (var key in localStorage) {
        if (key.startsWith('searchedMovie_')) {
            ctrl.movies.push(JSON.parse(localStorage.getItem(key)));
        }
    }

    ctrl.mapRating = function (movie) {
        if (!movie || !movie.imdbRating) {
            return 0;
        }
    
        var rating = parseFloat(movie.imdbRating);
        return Math.round(rating / 2);
    };

    ctrl.showDialog = function (movie) {
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
}]);
