angular.module('authentication', [])
.controller('LoginController', ['$scope', 'AuthService', '$location', function($scope, AuthService, $location) {
    $scope.signup = function() {
        $location.path('/signup');
    };
    $scope.login = function() {
        AuthService.login($scope.email, $scope.password)
        .then(function(response) {
            if (response.data.error) {
                alert("Login failed: " + response.data.error);
                $scope.email = null;
                $scope.password = null;
            } else {
                alert("Login successful");
                $location.path('/home');
            }
        })
        .catch(function(error) {
            console.error('Error occurred while logging in:', error);
            alert('An error occurred while logging in. Please try again later.');
        });
    };
}])
.controller('SignupController', ['$scope', 'AuthService', '$location', function($scope, AuthService, $location) {
    $scope.signup = function() {
        if ($scope.password !== $scope.confirmPassword) {
            alert("Password and confirm password do not match.");
            return; 
        }
        AuthService.signup($scope.email, $scope.firstName, $scope.gender, $scope.lastName, $scope.password, $scope.ph_number)
        .then(function(response) {
            if (response.data.error) {
                alert("Registration failed: " + response.data.error);
            } else {
                alert("Account created successfully");
                $location.path('/login');
            }
        })
        .catch(function(error) {
            console.error('Error occurred while logging in:', error);
            alert('An error occurred while logging in. Please try again later.');
        });
    };
    $scope.login = function() {
        $location.path('/login');
    };
}])
    .service('AuthService', ['$http', '$location', function($http) {
        this.login = function(email, password) {
            var credentials = { email: email, password: password };
            return $http.post('https://iot-data.mygreyter.com/greyter/api/v2/greyter-customer/auth/login', credentials)
            
        };
    
    this.signup = function(email, firstName, gender, lastName, password, ph_number) {
        var credentials = {email:email, first_name:firstName, gender:gender, last_name:lastName, password: password, phone:ph_number, terms:true };
        return $http.post('https://iot-data.mygreyter.com/greyter/api/v2/greyter-customer/auth/register', credentials)
    };

    }]);

