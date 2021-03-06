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
            var info = markerData[i][6];
            var address = markerData[i][10];
            recentBreakIns.push({
                key:"Location: " + address,
                value:"Message: " + info
            });
        }

    }, function(fail){
        console.log(fail);
    });

    $scope.recentBreakIns = recentBreakIns;

    $( document ).ready(function() {
      var mymap;
      var myLat;
      var myLng;

      var stateChangingButton = L.easyButton({
          states: [{
              stateName: 'zoom-in',   // name the state
              icon:      'fa-crosshairs',          // and define its properties
              onClick: function(btn, map) {  // and its callback
                  map.setView([myLat,myLng],18);
                  btn.state('zoom-in'); // change state on click!
              }
          }, {
              stateName: 'zoom-out',
              icon:      'fa-crosshairs',
              onClick: function(btn, map) {
                  map.setView([myLat,myLng],5);
                  btn.state('zoom-out');
              }
          }]
      });

     
      var options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(success, error, options);

      function success(pos) {
        crd = pos.coords;
        
        mymap = L.map('map', {
          layers: MQ.mapLayer(),
          center: [crd.latitude, crd.longitude ],
          zoom: 12
        });
        setMarkers(mymap);
        stateChangingButton.addTo( mymap );
        myLat = crd.latitude;
        myLng = crd.longitude;
        setSearch(mymap);
      };

      function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
        mymap = L.map('map', {
          layers: MQ.mapLayer(),
          center: [ 48.4648167, -123.3140889 ],
          zoom: 12
          });
        setMarkers(mymap);
        mymap.addControl( controlSearch );
      };
     
      var setSearch = function(mymap){
        mymap.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'));	//base layer

        var geocoder = new google.maps.Geocoder();

        function googleGeocoding(text, callResponse)
        {
          geocoder.geocode({address: text}, callResponse);
        }

        function formatJSON(rawjson)
        {
          var json = {},
            key, loc, disp = [];

          for(var i in rawjson)
          {
            key = rawjson[i].formatted_address;

            loc = L.latLng( rawjson[i].geometry.location.lat(), rawjson[i].geometry.location.lng() );

            json[ key ]= loc;	//key,value format
          }

          return json;
        }

        var controlSearch = new L.Control.Search({
            sourceData: googleGeocoding,
            formatData: formatJSON,
            autoType: false,
            minLength: 2,
            textPlaceholder: 'Search...',
                markerIcon: new L.Icon.Default(),
                initial: false,
                position:'topright'
          });
        mymap.addControl( controlSearch );
      };
     
      var setMarkers = function(mymap){
        // This makes the last set marker pop out. This only happens once, localstorage is cleared after.
        var lastAdded = $window.localStorage['last']; 
        if (lastAdded){
          $window.localStorage['last'] = "";
          var last =  JSON.parse(lastAdded); 
          var marker = L.marker([parseFloat(last.latitude), parseFloat(last.longitude)]).addTo(mymap);
          var popup = '<form action="/delete/'+last.id+'" method="get"> <button type="submit" class="btn btn-xs btn-block">Delete Data Point</button></form><br><b>'+last.message+'</b><br>By '+last.user;
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
              <button class="btn btn-xs btn-block" type="submit">Yes!</button>\
          </form>'; 
          popup
            .setLatLng(e.latlng)
            .setContent(myContent)
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
