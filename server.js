var io = require('socket.io').listen(8000);
var mysql = require("mysql");
var db = mysql.createConnection({
	host: 'localhost', 
	port: '3306',
	database: 'sismapp', 
	user : 'root', 
	password: ''
});


io.sockets.on('connection', function (socket) {

	var queryOnConnect = "select * from save";
	db.query(queryOnConnect, function(err, rows) {
		console.log("Connection");
		if(err != null) {
			console.log("CONNECTION ERROR: "+err);
		}
		else {
			var datas = new Array();
			rows.forEach(function (row) {
				var data = {
					alias: row['alias'],
					lat: row['latitude'],
					long: row['longitude']
				};
				console.log(data);
				datas.push(data);
			});
			console.log(datas);
			socket.emit('before',datas);
		}
	});


  socket.on('update position', function (data) {

    socket.set('lat', data.lat);
    socket.set('long', data.long);
    socket.emit("update position", "ok");

  });
  
  socket.on('alert', function (data) {

    console.log(data);
    var alias = data.alias;
    var lat = data.lat;
    var long = data.long;

	// Sauvergarder en base de données l'alerte
	var query = "insert into save(alias, latitude, longitude) values ('"+alias+"', '"+lat+"', '"+long+"');";
	console.log(query);
	db.query(query, function(err, rows){
		if(err != null) {
			console.log('Erreur DB : ' + err);
		}
	});
	
    io.sockets.clients().forEach(function (socket2) { 
        if(socket != socket2) {
            var userLat;
            var userLong;

            socket2.get("lat",function(err,value) {
                userLat = value;
            });
            socket2.get("long",function(err,value) {
                userLong = value;
            });
        
            console.log("Lat: " + lat + ", long: " + long + ", lat2: " + userLat + ", long2: " + userLong + " , distance: " + 
                getDistanceFromLatLonInKm(lat,long,userLat,userLong));

            // Si la distance entre le séisme et l'utilisateur est inférieure à 2 km.
            if(lat != null && long != null && userLat != null && userLong != null && 
                getDistanceFromLatLonInKm(lat,long,userLat,userLong) < 2) {
                socket2.emit('alert', 
                 { 
                    alias:alias,
                    lat:lat,
                    long:long 
                 } 
                );
            }
        }
    });    
  });

  
});

// Haversine formula
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}