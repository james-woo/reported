angular.module('app').controller('reMainCtrl', function($scope, $window, DataManager) {
    $scope.recentBreakIns = [
        { location: 'Shelbourne Corridor', time: 'January' }
    ];

    $( document ).ready(function() {  
      var options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
      };      
      navigator.geolocation.getCurrentPosition(success, error, options);

      function success(pos) {
        crd = pos.coords;
        
        var mymap = L.map('map', {
          layers: MQ.mapLayer(),
          center: [crd.latitude, crd.longitude ],
          zoom: 12
        });
        setMarkers(mymap);
      };

      function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
        var mymap = L.map('map', {
          layers: MQ.mapLayer(),
          center: [ 48.4648167, -123.3140889 ],
          zoom: 12
          });
        setMarkers(mymap);
      };
     
      var setMarkers = function(mymap){
        
        // This makes the last set marker pop out. This only happens once, localstorage is cleared after.
        var lastAdded = $window.localStorage['last']; 
        if (lastAdded){
          $window.localStorage['last'] = "";
          var last =  JSON.parse(lastAdded); 
          var marker = L.marker([parseFloat(last.latitude), parseFloat(last.longitude)]).addTo(mymap);
          marker.bindPopup("<b>"+last.user+"</b><br>"+last.message+".").openPopup();
        }
        DataManager.viewTableData({
        "clientId": "j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa",
        "password": "fLbpuA3vTZHubZqt",
        "tableName": "mqap.j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa_reported_points"
        }).then(function(res){          
            console.log(res.data.tableName);
            markerData = res.data.data.rows;

            for (i = 0; i < markerData.length; i++) { 
              myMarker = L.marker([markerData[i][7], markerData[i][8]]).addTo(mymap);
              myMarker.bindPopup("<b>"+markerData[i][3]+"</b><br>"+markerData[i][6]+"<br> on " + markerData[i][5]); 
            }
             
        }, function(fail){
            console.log(fail);
        });
        
        var popup = L.popup();

        function onMapClick(e) {
          console.log("You clicked the map at " + e.latlng.toString())
          var myContent = '<form action="/submitdata/'+e.latlng.lat.toString()+'/'+e.latlng.lng.toString()+'" method="get">\
             <div> Make a report here? </div>\
             <div class="button">\
              <button type="submit">Yes!</button>\
            </div>\
          </form>'; 
          popup
            .setLatLng(e.latlng)
            .setContent(myContent)
            .openOn(mymap);
        }
        
        mymap.on('click', onMapClick);
      };
    });


})

.controller('formCtrl', function($scope, $routeParams, $window, DataManager) {
  
  $scope.comment = {user:"", email:"", message:"", date:"", latitude:"", longitude:""};
 
  var json = {
     "tableName":"mqap.j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa_reported_points",
     "returnResults":true,
     "append":true,
     "clientId":"j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa",
     "password":"fLbpuA3vTZHubZqt"
  }

  $scope.submitComment = function () {
    
    $scope.comment.date = new Date().toISOString();
    $scope.comment.latitude = $routeParams.lat; 
    $scope.comment.longitude = $routeParams.lng; 
    
      var stupidFormat = [
             {"name":"user","value":$scope.comment.user},
             {"name":"email","value":$scope.comment.email},
             {"name":"date","value":$scope.comment.date},
             {"name":"message","value":$scope.comment.message},
             {"name":"latitude","value":$scope.comment.latitude},
             {"name":"longitude","value":$scope.comment.longitude},
             {"name":"latlong","value":"POINT (1 1)"}
             //{"name":"latlong","value":"POINT ("+parseFloat($scope.comment.latitude)+" "+parseFloat($scope.comment.longitude)+")"}
           ]
      json.rows = [stupidFormat]; 
      
      DataManager.uploadTableData(json)
        .then(
          function(success){
            console.log(success);
            $window.localStorage['last'] = JSON.stringify($scope.comment); 
            $scope.comment = {user:"", email:"", message:"", date:"", latitude:"", longitude:""};
            window.location.href = "/"; 
          }, 
          function(fail){
            console.log(fail);
          }
        );
      
      
		}
})

;

/*
// How to add a circle and a polygon
        var circle = L.circle([51.508, -0.11], 500, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5
        }).addTo(mymap);

        var polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047]
        ]).addTo(mymap);
*/
