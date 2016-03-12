angular.module('app').controller('reMainCtrl', function($scope, $window) {
    $scope.recentBreakIns = [
        { location: 'Shelbourne Corridor', time: 'January' }
    ]

    $( document ).ready(function() {
        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        function success(pos) {
            var crd = pos.coords;

            console.log('Your current position is:');
            console.log('Latitude : ' + crd.latitude);
            console.log('Longitude: ' + crd.longitude);
            console.log('More or less ' + crd.accuracy + ' meters.');

            L.map('map', {
                layers: MQ.mapLayer(),
                center: [ crd.latitude, crd.longitude ],
                zoom: 12
            });
        };

        function error(err) {
            console.warn('ERROR(' + err.code + '): ' + err.message);
            L.map('map', {
                layers: MQ.mapLayer(),
                center: [51.505, -0.09],
                zoom: 12
            });
        };

        navigator.geolocation.getCurrentPosition(success, error, options);
    });
});