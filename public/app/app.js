angular.module('app', ['ngResource', 'ngRoute', 'DataManagerServices']);

angular.module('app').config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', { templateUrl: '/partials/main', controller: 'reMainCtrl'})
        .when('/submitdata', { templateUrl: '/partials/form', controller: 'formCtrl'});
});
