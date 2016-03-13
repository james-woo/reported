angular.module('app').controller('deleteCtrl', function($scope, $routeParams, $window, DataManager) {

    var json = {
        "tableName":"mqap.j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa_reported_points",
        "clientId":"j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa",
        "password":"fLbpuA3vTZHubZqt",
        "mqap_id":$routeParams.id
    };
    DataManager.deleteTableData(json)
        .then(
            function(success){
                window.location.href = "/";
            },
            function(fail){
                window.location.href = "/";
            }
        );

});