// localServer.js
var five = require("johnny-five");
var os = require("os");

var remoteServer = require("socket.io-client")("http://server7.tezzt.nl:3001"); // This is a client connecting to the SERVER 2
var led, potmeter, potPrevVal;


var board = new five.Board();
// Client
var socket = remoteServer.connect("http://server7.tezzt.nl:3001");
board.on("ready", function () {

    console.log(Date.now() + " Server gestart");

        potmeter = new five.Sensor({
        pin:"A0",
        freq:500
    });

        led = new five.Led({
        	pin: 13
        });
    	led.off(); // start with led off


    socket.on('ledOn', function (data) {
        console.log("ledOn")
        led.on();
    });

    socket.on('ledOff', function (data) {
        console.log("ledOff")
        led.off();
    });

        potmeter.on("data", function () {

        if (potPrevVal !== this.value) {

            var obj = {
                dateTime: Date.now(),
                sensor: "potmeter",
                action: "up",
                description: "potmeter value changed",
                pin: "A0",
                value: this.value
            };
            console.log(obj);

            socket.emit("potmeter", obj);

            potPrevVal = this.value;
        }
    });

});