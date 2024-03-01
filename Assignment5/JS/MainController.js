angular.module('movieSearch', ['ngMaterial', 'authentication', 'ui.router'])
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/login"); 
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'home.html',
            controller: 'MainController', 
            controllerAs: 'ctrl' 
        })
        .state('login', {
            url: '/login',
            templateUrl: 'login.html',
            controller: 'LoginController'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'signup.html',
            controller: 'SignupController'
        });
}]);

angular.module('movieSearch').constant('genreConst',{
    'ALL':'ALL',
    'Action':'Action',
    'Drama':'Drama',
    'Sci-Fi':'Sci-Fi',
    'Comedy':'Comedy',
    'Horror':'Horror'
})
.component('toolbarComponent', {
    templateUrl: 'toolbar.html',
    controller: 'MainController'
})
.controller('MainController', ['$scope', '$http', '$mdDialog', '$mdSidenav', '$mdMedia', 'genreConst', function($scope, $http, $mdDialog, $mdSidenav, $mdMedia, genreConst) {
    //sidenav
    $scope.isSidenavLockedOpen = function() {
        return $mdMedia('gt-sm') && $mdSidenav('left').isLockedOpen();
    };
    $scope.toggleLeft = function() {
        $mdSidenav('left').toggle();
    };

    //SearchMovie
    var ctrl = this;
    ctrl.genres = Object.values(genreConst);
    ctrl.selectedGenre = genreConst.ALL;
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
            controller: function() {
                var dialogCtrl = this;
                dialogCtrl.selectedMovie = angular.copy(ctrl.selectedMovie);
                var originalMovie = angular.copy(ctrl.selectedMovie);

                dialogCtrl.resetChanges = function () {
                    dialogCtrl.selectedMovie = angular.copy(ctrl.selectedMovie);
                };

                dialogCtrl.userRating = ctrl.selectedMovie.rating;

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
            },
            controllerAs: 'dialogCtrl',
            templateUrl: 'Edit_Details.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        });
    }
}]);
