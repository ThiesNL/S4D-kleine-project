var socket = io.connect();

//Define variables off Triggers
var ledOn = document.getElementById("ledOn");
var ledOff = document.getElementById("ledOff");
var servoOn = document.getElementById("servoOn");
var servoOff = document.getElementById("servoOff");
var buzzerOn = document.getElementById("buzzerOn");

//Define variables off Data		
var tempData = document.getElementById("tempData");	
var lightData = document.getElementById("lightData");	
var potData = document.getElementById("potData");	
var fsrData = document.getElementById("fsrData");			

// ==== Arduino Triggers ==== 
//LED
ledOn.onclick = function(){
   	socket.emit("ledOn");
};
   			 
ledOff.onclick = function(){
   	socket.emit("ledOff");
};

//Servo
servoOn.onclick = function(){
   	socket.emit("servoOn");
};

servoOff.onclick = function(){
   	socket.emit("servoOff");
};

//Buzzer
buzzerOn.onclick = function(){
   	socket.emit("buzzerOn");
};

//Arduino Data
//Temperature Sensor
socket.on("tempSensorData", function (data) {
	tempData.innerHTML = data;
});

//Light Sensor
socket.on("ldrSensorData", function (data) {
	lightData.innerHTML = data;
});

//Potentiometer
socket.on("potSensorData", function (data){
	potData.innerHTML = data;
});

//FSR Sensor
socket.on("fsrSensorData", function (data){
	fsrData.innerHTML = data;
});

