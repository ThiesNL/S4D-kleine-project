// localServer.js
var five = require("johnny-five");
var os = require("os");
var board = new five.Board();
var localConfig = require('../config/config.json');
var remoteServer = require("socket.io-client")(localConfig.remote.fqdn + ':' + localConfig.remote.port); // This is a client connecting to the SERVER 2
var button, potentiometer, potPrevVal, fsr, fsrPrevVal, ldr,ldrPrevVal, temp, tempPrevVal, motor, servo, buzzer, led;

// Client
var socket = remoteServer.connect(localConfig.remote.fqdn + ':' + localConfig.remote.port);
board.on("ready", function () {

    console.log(Date.now(), "Board is now ready for reading from sensors and writing to actors.");




    // Input
    potentiometer = new five.Sensor({
        pin: localConfig.local.potentiometer,
        freq: 250
    });

    fsr = new five.Sensor({
        pin: localConfig.local.fsr,
        freq:250
    });

    ldr = new five.Sensor({
        pin: localConfig.local.ldr,
        freq:250
    });

    temp = new five.Sensor({
        pin: localConfig.local.temp,
        freq:250
    });

    //Output


    button = new five.Button(
        localConfig.local.pushButton);

    led = new five.Led(
        localConfig.local.led);
    led.off(); // start with led off

    servo = new five.Servo({
        pin: localConfig.local.servo,
        type: "continuous"
    });

    motor = new five.Motor({
        pin: localConfig.local.motor
    });

    buzzer = new five.Piezo(localConfig.local.buzzer);



    // socket events
    socket.on('connect', function () {
        var obj = {
            dateTime: Date.now(),
            actor: "os",
            action: null,
            description: "Laptop connected with server!",
            pin: null,
            value: null,
            detail: {
                hostname: os.hostname(),
                networkInterfaces: os.networkInterfaces()
            }
        };
        console.log(obj);
        socket.emit("boardSensor", obj);

    });

    socket.on('setMilliseconds', function (data) {
        var rate = parseInt(data, 10);
        var obj = {
            dateTime: Date.now(),
            actor: "led",
            action: "strobe",
            description: "rate of strobe set",
            pin: localConfig.local.led,
            value: rate
        };

        console.log(obj);

        led.strobe(rate);

        socket.emit("boardSensor", obj);


    });

    // socket.on('setServo', function (data) {
    //     var angle = parseInt(data, 10);
    //     if (angle > 175) {
    //         angle = 175;
    //     }
    //     var obj = {
    //         dateTime: Date.now(),
    //         actor: "servo",
    //         action: "to",
    //         description: "Set servo to degrees",
    //         pin: localConfig.local.servo,
    //         value: angle
    //     };

    //     console.log(obj);

    //     servo.to(angle); // half speed clockwise

    //     socket.emit("boardSensor", obj);

    // });

    socket.on('setServoCw', function(data){
        servo.cw();
        
    });

    socket.on('setServoCcw', function(data){
        servo.ccw();
    });

    // board.repl.inject({
    //     motor: motor
    // });

  // Motor Event API

  // "start" events fire when the motor is started.
    motor.on("start", function(err, timestamp) {
        console.log("start", timestamp);

    // Demonstrate motor stop in 2 seconds
    board.wait(2000, function() {
        motor.stop();
    });
  });

  // "stop" events fire when the motor is started.
    motor.on("stop", function(err, timestamp) {
        console.log("stop", timestamp);
  });



    socket.on('motorRun', function(data){
        motor.start();
        console.log('motorRun');
    })

    //  socket.on('motorStop', function(data){
    //     motor.stop();
    // })

    socket.on ('playBuzzer', function (){

     buzzer.play({
    // song is composed by an array of pairs of notes and beats
    // The first argument is the note (null means "no note")
    // The second argument is the length of time (beat) of the note (or non-note)
    song: [
      ["C4", 1 / 4],
      ["D4", 1 / 4],
      ["F4", 1 / 4],
      ["D4", 1 / 4],
      ["A4", 1 / 4],
      [null, 1 / 4],
      ["A4", 1],
      ["G4", 1],
      [null, 1 / 2],
      ["C4", 1 / 4],
      ["D4", 1 / 4],
      ["F4", 1 / 4],
      ["D4", 1 / 4],
      ["G4", 1 / 4],
      [null, 1 / 4],
      ["G4", 1],
      ["F4", 1],
      [null, 1 / 2]
    ],
    tempo: 100
  });

    var obj = {
            dateTime: Date.now(),
            actor: "buzzer",
            action: "to",
            description: "Play a song",
            pin: localConfig.local.buzzer,
            // value: playing
        };

        console.log(obj);

        socket.emit("boardSensor", obj);
    });


    // Button Event API
    /**
     * http://node-ardx.org/exercises/7
     */
    button.on("down", function (value) {
        var obj = {
            dateTime: Date.now(),
            sensor: "pushButton",
            action: "down",
            description: "button pressed down",
            pin: localConfig.local.pushButton,
            value: value,
            pressed: true
        };
        console.log(obj);

        socket.emit("boardSensor", obj);
    });

    button.on("up", function (value) {
        var obj = {
            dateTime: Date.now(),
            sensor: "pushButton",
            action: "up",
            description: "button released",
            pin: localConfig.local.pushButton,
            value: value,
            pressed: true
        };
        console.log(obj);

        socket.emit("boardSensor", obj);
    });

    button.on("hold", function (value) {
        var obj = {
            dateTime: Date.now(),
            sensor: "pushButton",
            action: "hold",
            description: "button hold",
            pin: localConfig.local.pushButton, // was 2
            value: value,
            pressed: true
        };
        console.log(obj);

        socket.emit("boardSensor", obj);
    });

    button.on("up", function (value) {
        var obj = {
            dateTime: Date.now(),
            sensor: "pushButton",
            action: "up",
            description: "button pressed up",
            pin: localConfig.local.pushButton, // was 2
            value: value,
            pressed: true
        };
        console.log(obj);

        socket.emit("boardSensor", obj);
    });


    potentiometer.on("data", function () {

        if (potPrevVal !== this.value) {

            var obj = {
                dateTime: Date.now(),
                sensor: "potentiometer",
                action: "up",
                description: "potentiometer value changed",
                pin: localConfig.local.potentiometer,
                value: this.value
            };
            // console.log(obj);

            socket.emit("potSensor", obj);

            potPrevVal = this.value;
        }
    });

    //     fsr.on("data", function () {

    //     if (fsrPrevVal !== this.value) {

    //         var obj = {
    //             dateTime: Date.now(),
    //             sensor: "fsr",
    //             action: "up",
    //             description: "fsr value changed",
    //             pin: localConfig.local.fsr,
    //             value: this.value
    //         };
    //         console.log(obj);

    //         socket.emit("fsrSensor", obj);

    //         fsrPrevVal = this.value;
    //     }
    // });

        fsr.on("data", function () {

        if (fsrPrevVal !== this.value) {

            var obj = {
                value: this.value
            };
            // console.log(obj);

            socket.emit("fsrSensor", this.value);

            fsrPrevVal = this.value;
        }
    });

        ldr.on("data", function () {

        if (ldrPrevVal !== this.value) {

            var obj = {
                dateTime: Date.now(),
                sensor: "ldr",
                action: "up",
                description: "ldr value changed",
                pin: localConfig.local.ldr,
                value: this.value
            };
            // console.log(obj);

            socket.emit("ldrSensor", obj);

            ldrPrevVal = this.value;
        }
    });


  // function analogToCelsius(analogValue) {
  //   // For the TMP36 sensor specifically
  //   return ((analogValue * 0.004882814) - 0.5) * 100;
  // }

        temp.on("data", function () {

        if (tempPrevVal !== this.value) {

            var obj = {
                dateTime: Date.now(),
                sensor: "temp",
                action: "up",
                description: "temp value changed",
                pin: localConfig.local.temp,
                value: ((this.value * 0.004882814) - 0.5) * 100
            };
            // console.log(obj);

            socket.emit("tempSensor", obj);

            tempPrevVal = this.value;
        }
    });

        ldr.on("data", function () {

        if (ldrPrevVal !== this.value) {

            var obj = {
                dateTime: Date.now(),
                sensor: "ldr",
                action: "up",
                description: "ldr value changed",
                pin: localConfig.local.ldr,
                value: this.value
            };
            // console.log(obj);

            socket.emit("ldrSensor", obj);

            ldrPrevVal = this.value;
        }
    });

});
