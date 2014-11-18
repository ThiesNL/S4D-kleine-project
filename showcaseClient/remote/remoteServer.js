var express = require("express"),
	app = express(),
	server = require("http").createServer(app),
	io = require("socket.io").listen(server),
	localConfig = require('../config/config.json'),
    port = localConfig.remote.port;
	
app.use(express.static(__dirname + '/'));

server.listen(port, function(){
	console.log('Listening on port ' + port);
});

io.sockets.on("connection", function(socket){

	// ==== Arduino Triggers =====
	//LED	
	socket.on("ledOn", function(){
		io.sockets.emit("ledOn");
	});
	
	socket.on("ledOff", function () {
    	io.sockets.emit("ledOff");
    }); 
    
    //Servo
	socket.on("servoOn", function () {
        io.sockets.emit("servoOn");
    });

	socket.on("servoOff", function () {
        io.sockets.emit("servoOff");
    });
    
    //Buzzer
	socket.on("buzzerOn", function () {
        io.sockets.emit("buzzerOn");
    });


	// ==== Arduino Data =====
	//Temperature Sensor
	socket.on("tempSensor", function (data) {
        io.sockets.emit('tempSensorData', Math.round(data));
    });
    
	//Light Sensor
	socket.on("ldrSensor", function (data) {
        io.sockets.emit('ldrSensorData', data);
    });
    
    //Potentiometer
    socket.on("potSensor", function (data){
    	io.sockets.emit('potSensorData', data);
    });
    
    //FSR Sensor
    socket.on("fsrSensor", function (data){
    	io.sockets.emit('fsrSensorData', data);
    });
	
});