var io = require("socket.io").listen(8089);
var five = require("johnny-five");
var os = require("os");
var board = new five.Board();
var localConfig = require('../config/config.json');
var remoteServer = require("socket.io-client")(localConfig.remote.fqdn + ':' + localConfig.remote.port);
var button, potentiometer, potPrevVal, fsr, fsrPrevVal, ldr,ldrPrevVal, temp, tempPrevVal, servo, buzzer, led;

remoteServer.on("connect", function(){
	console.log("other server connect");
});

var socket = remoteServer.connect(localConfig.remote.fqdn + ':' + localConfig.remote.port);

board.on("ready", function(){
	
	// ==== Define Arduino Electronics ====
	//LED
	led = new five.Led(localConfig.local.led);
	led.off();
	
	//Servo
    servo = new five.Servo({
        pin: localConfig.local.servo,
        type: "continuous"
    });

	//Buzzer
	buzzer = new five.Piezo(localConfig.local.buzzer);

	//Temperature sensor
	temp = new five.Sensor({
        pin: localConfig.local.temp,
        freq:1000
    });

	//Light sensor
	ldr = new five.Sensor({
		pin: localConfig.local.ldr,
		freq:1000
	});

	potentiometer = new five.Sensor({
		pin: localConfig.local.potentiometer,
		freq:1000
	});
	
	fsr = new five.Sensor({
		pin: localConfig.local.fsr,
		freq:250
	})

	// ==== Arduino Triggers ====
	//LED
	socket.on('ledOn', function(){
		led.on();
	});

	socket.on('ledOff', function(){
		led.off();
	});	

    
    //Servo
	socket.on('servoOn', function(){
        servo.cw();
    });
    
    socket.on('servoOff', function(){
        servo.ccw();
    });


	//Buzzer
	socket.on('buzzerOn', function(){
    buzzer.play({
    tempo: 100000,
    // song is composed by an array of pairs of notes and beats
    // The first argument is the note (null means "no note")
    // The second argument is the length of time (beat) of the note (or non-note)
    song: [
    ["A", 500],
    [null, 50],
    ["A", 500],
    [null, 50],
    ["A", 500],
    [null, 50],
    ["F", 350],
    [null, 50],
    ["C5", 150],
    [null, 50],
    ["A", 500],
    [null, 50],
    ["F", 350],
    [null, 50],
    ["C5", 150],
    [null, 50],
    ["A", 650],
    [null, 50],
    [null, 500],
    ["E5", 500],
    [null, 50],
    ["E5", 500],
    [null, 50],
    ["E5", 500],
    [null, 50],
    ["F5", 350],
    [null, 50],
    ["C5", 150],
    [null, 50],
    ["G4", 500],
    [null, 50],
    ["F", 350],
    [null, 50],
    ["C5", 150],
    [null, 50],
    ["A", 650],
    [null, 50],
    [null, 500],

    ["A5", 500],
    [null, 50],
    ["A", 300],
    [null, 50],
    ["A", 150],
    [null, 50],
    ["A5", 500],
    [null, 50],
    ["G#5", 325],
    [null, 50],
    ["G5", 175],
    [null, 50],
    ["F#5", 125],
    [null, 50],
    ["F5", 125],
    [null, 50],
    ["F#5", 250],
    [null, 50],
    [null, 325],
    ["A4", 250],
    [null, 50],
    ["D#5", 500],
    [null, 50],
    ["D5", 325],
    [null, 50],
    ["C#5", 175],
    [null, 50],
    ["C5", 125],
    [null, 50],
    ["B", 125],
    [null, 50],
    ["C5", 250],
    [null, 50],
    [null, 350],

    ["F", 250],
    [null, 50],
    ["G4", 500],
    [null, 50],
    ["F", 350],
    [null, 50],
    ["A", 125],
    [null, 50],
    ["C5", 500],
    [null, 50],
    ["A", 375],
    [null, 50],
    ["C5", 125],
    [null, 50],
    ["E5", 650],
    [null, 50],
    [null, 500],

    ["A5", 500],
    [null, 50],
    ["A", 300],
    [null, 50],
    ["A", 150],
    [null, 50],
    ["A5", 500],
    [null, 50],
    ["G#5", 325],
    [null, 50],
    ["G5", 175],
    [null, 50],
    ["F#5", 125],
    [null, 50],
    ["F5", 125],
    [null, 50],
    ["F#5", 250],
    [null, 50],
    [null, 325],
    ["A4", 250],
    [null, 50],
    ["D#5", 500],
    [null, 50],
    ["D5", 325],
    [null, 50],
    ["C#5", 175],
    [null, 50],
    ["C5", 125],
    [null, 50],
    ["B", 125],
    [null, 50],
    ["C5", 250],
    [null, 50],
    [null, 350],

    ["F", 250],
    [null, 50],
    ["G4", 500],
    [null, 50],
    ["F", 375],
    [null, 50],
    ["C5", 125],
    [null, 50],
    ["A", 500],
    [null, 50],
    ["F", 375],
    [null, 50],
    ["C5", 125],
    [null, 50],
    ["A", 650],
    [null, 50],
    [null, 650]
    ]
  });
    });
    

	//Arduino Data
	//Temperature sensor
	temp.on("data", function () {
        if (tempPrevVal !== this.value) {
        	var tempValue = ((this.value * 0.004882814) - 0.5) * 100
            socket.emit("tempSensor", tempValue);
            tempPrevVal = this.value;
        }
    });
    
    //Light Sensor
    ldr.on("data", function() {
    	if (ldrPrevVal !== this.value){
    		socket.emit("ldrSensor", this.value);
    		ldrPrevVal = this.value;
    	}
    });
    
    //Potentiometer
    potentiometer.on("data", function(){
    	if (potPrevVal !== this.value){
    		socket.emit("potSensor", this.value);
    		potPrevVal = this.value;
    	}
    });
    
    //Force Sensitive Resistor
        fsr.on("data", function(){
    	if (fsrPrevVal !== this.value){
    		socket.emit("fsrSensor", this.value);
    		fsrPrevVal = this.value;
    	}
    });
});