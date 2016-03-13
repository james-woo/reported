angular.module('app').controller('formCtrl', function($scope, $routeParams, $window, DataManager) {
    var table = "mqap.j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa_reported_points";
    var clientId = "j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa";
    var password = "fLbpuA3vTZHubZqt";

    $scope.comment = {user:"", email:"", message:"", imageurl:"", date:"", latitude:"", longitude:""};

    var json = {
        "tableName":table,
        "returnResults":true,
        "append":true,
        "clientId":clientId,
        "password":password
    };

    $scope.submitComment = function () {
        $scope.comment.date = new Date().toISOString();
        $scope.comment.latitude = $routeParams.lat;
        $scope.comment.longitude = $routeParams.lng;

        var request = [
            {"name":"user","value":$scope.comment.user},
            {"name":"email","value":$scope.comment.email},
            {"name":"date","value":$scope.comment.date},
            {"name":"message","value":$scope.comment.message},
            {"name":"latitude","value":$scope.comment.latitude},
            {"name":"longitude","value":$scope.comment.longitude},
            {"name":"imageurl","value":$scope.comment.imageurl},
            {"name":"latlong","value":"POINT(" + parseFloat($scope.comment.longitude) + " " + parseFloat($scope.comment.latitude) +")"}
        ];
        json.rows = [request];


        var latlng = {
            "lng":$scope.comment.longitude,
            "lat":$scope.comment.latitude
        };
        MQ.geocode().reverse(latlng).on('success', function(e){
            var best = e.data.results[0].locations[0].street;
            json.rows[0].push({"name":"address","value":best});
            DataManager.uploadTableData(json)
                .then(
                    function(success){
                        console.log(success);
                        $scope.comment.id = success.data.data.rows[0][0];
                        $window.localStorage['last'] = JSON.stringify($scope.comment);
                        $scope.comment = {user:"", email:"", message:"", date:"", latitude:"", longitude:""};
                        window.location.href = "/";
                    },
                    function(fail){
                        console.log(fail);
                    }
                );
        });
    }
});
