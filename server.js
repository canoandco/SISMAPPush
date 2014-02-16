var io = require('socket.io').listen(8000);

io.sockets.on('connection', function (socket) {
  
  socket.on('alert', function (data) {

    console.log(data);
    var alias = data.alias;
    var lat = data.lat;
    var long = data.long;

    socket.broadcast.emit('alert', 
     { 
    	alias:alias,
    	lat:lat,
    	long:long 
     } 
     );
  });

  
});