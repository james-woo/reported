angular.module('app', ['ngResource', 'ngRoute', 'DataManagerServices']);

angular.module('app').config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', { templateUrl: '/partials/main', controller: 'reMainCtrl'})
        .when('/submitdata/:lat/:lng', { templateUrl: '/partials/form', controller: 'formCtrl'})
        .when('/delete/:id', { templateUrl: '/partials/loading', controller: 'deleteCtrl'});
});
