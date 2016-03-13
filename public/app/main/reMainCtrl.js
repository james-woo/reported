angular.module('app').controller('reMainCtrl', function($scope, DataManager) {
    $scope.recentBreakIns = [
        { location: 'Shelbourne Corridor', time: 'January' }
    ];

    console.log(DataManager);

        DataManager.viewTableData({
        "clientId": "j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa",
        "password": "fLbpuA3vTZHubZqt",
        "tableName": "mqap.j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa_reported_points"
        }).then(function(out){
            console.log(out.data.tableName);
        }, function(fail){
            console.log(fail);
        });


    $( document ).ready(function() {  
      var options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
      };      
      navigator.geolocation.getCurrentPosition(success, error, options);

      function success(pos) {
        crd = pos.coords;

        console.log('Your current position is:');
        console.log('Latitude : ' + crd.latitude);
        console.log('Longitude: ' + crd.longitude);
        console.log('More or less ' + crd.accuracy + ' meters.');
        
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
        // How to add a point
        var marker = L.marker([48.4633, -123.33312]).addTo(mymap);

        marker.bindPopup("<b>JD Home!</b><br>A stolen kiss.").openPopup();

        var popup = L.popup();

        function onMapClick(e) {
          popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(mymap);
        }
        mymap.on('click', onMapClick);
      };
    });


});

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
