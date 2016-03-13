angular.module('app').controller('reMainCtrl', function($scope, $window, DataManager) {
    var recentBreakIns = [];
    var table = "mqap.j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa_reported_points";
    var clientId = "j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa";
    var password = "fLbpuA3vTZHubZqt";
    var d = new Date();
    d.setDate(d.getDate());
    d = d.toISOString().slice(0,10);

    DataManager.viewTableData({
        "clientId": clientId,
        "password": password,
        "tableName": table,
        "extraCriteria": "UPPER(\"date\"::text) LIKE ?",
        "parameters": ["%" + d + "%"]
    }).then(function(res){
        markerData = res.data.data.rows;

        for (i = 0; i < markerData.length; i++) {
            var date = new Date(markerData[i][5]);
            var info = markerData[i][6];
            var address = markerData[i][10];
            recentBreakIns.push({
                key:date.toDateString(),
                value:address + ", Message: " + info
            });
        }

    }, function(fail){
        console.log(fail);
    });

    $scope.recentBreakIns = recentBreakIns;

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
          
          var popup = '<form action="/delete/'+last.id+'" method="get"> <button type="submit" class="btn btn-xs">Delete Data Point</button></form><br><b>'+last.message+'</b><br>By '+last.user;
          if (last.imageurl){
            popup = popup + '<br><img src="'+last.imageurl+'" style="width:200px;">'
          }
          
          marker.bindPopup(popup).openPopup();
        }
                
        DataManager.viewTableData({
        "clientId": clientId,
        "password": password,
        "tableName": table
        }).then(function(res){
            markerData = res.data.data.rows;
            
            var markerClusters = L.markerClusterGroup();
            
            for (i = 0; i < markerData.length; i++) {
              
              var latitude = markerData[i][7]; 
              var longitude = markerData[i][8]; 
              //myMarker = L.marker([latitude, longitude]).addTo(mymap);
              
              var name = markerData[i][3]; 
              var info = markerData[i][6]; 
              var date = new Date(markerData[i][5]); 
              var photoUrl = markerData[i][11];
              var popup = "<b>"+info+"</b><br>By "+name+"<br><i>" + date.toDateString()+"</i>";
              if (photoUrl){
                popup = popup + '<br><img src="'+photoUrl+'" style="width:200px;">'
              }                
              var m = L.marker([latitude, longitude]).bindPopup( popup );
             
              markerClusters.addLayer( m );
          }
 
          mymap.addLayer( markerClusters );
             
        }, function(fail){
            console.log(fail);
        });
        
        var popup = L.popup();

        function onMapClick(e) {
          console.log("You clicked the map at " + e.latlng.toString());
          var myContent = '<form action="/submitdata/'+e.latlng.lat.toString()+'/'+e.latlng.lng.toString()+'" method="get">\
             <div> Make a report here? </div>\
              <button class="btn btn-xs" type="submit">Yes!</button>\
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
})

.controller('deleteCtrl', function($scope, $routeParams, $window, DataManager) {
  
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
