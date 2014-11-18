// remoteServer.js
var express = require("express"),
    app = express(),
    server = require("http").createServer(app),
    io = require("socket.io").listen(server),
    localConfig = require('../config/config.json'),
    port = localConfig.remote.port;

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

server.listen(port, function () {
    console.log('Listening on port ' + port);
});

io.sockets.on("connection", function (socket) {

    io.sockets.emit('logMessage', {
        dateTime: Date.now(),
        data: "Connected with server."
    });

    socket.on("setMilliseconds", function (data) {
        console.log('setting milliseconds on arduino to', data);
        io.sockets.emit("setMilliseconds", data);
    });

    socket.on("setServo", function (data) {
        console.log('setting servo to degrees', data);
        io.sockets.emit("setServo", data);
    });

        socket.on("setServoCw", function (data) {
        console.log('setting servo to clock wise');
        io.sockets.emit("setServoCw");
    });
        socket.on("setServoCcw", function (data) {
        console.log('setting servo to counter clock wise', data);
        io.sockets.emit("setServoCcw");
    });
        socket.on("motorRun", function (data) {
        console.log('motorRun');
        io.sockets.emit("motorRun");
    });
    //     socket.on("motorStop", function (data) {
    //     console.log('motorStop');
    //     io.sockets.emit("motorStop");
    // }); 

    socket.on("playBuzzer", function (data) {
        console.log('playing buzzer', data);
        io.sockets.emit("playBuzzer");
    });


    // When we receive a message...
    socket.on("boardSensor", function (data) {
        // console.log('boardSensor', data);

        io.sockets.emit('logMessage', {
            dateTime: Date.now(),
            data: data
        });
    });

    // socket.on("fsrSensor", function (data) {
    //     console.log('fsrSensor', data);

    //     io.sockets.emit('logMessageFsr', {
    //         dateTime: Date.now(),
    //         data: data
    //     });
    // });


    socket.on("fsrSensor", function (data) {
        // console.log('fsrSensor', data);

        io.sockets.emit('logMessageFsr', data );
    });

    socket.on("ldrSensor", function (data) {
        // console.log('ldrSensor', data);

        io.sockets.emit('logMessageLdr', {
            dateTime: Date.now(),
            data: data
        });
    });

    socket.on("tempSensor", function (data) {
        // console.log('tempSensor', data);

        io.sockets.emit('logMessageTemp', {
            dateTime: Date.now(),
            data: data
        });
    });

    socket.on("potSensor", function (data) {
        // console.log('potSensor', data);

        io.sockets.emit('logMessagePot', {
            dateTime: Date.now(),
            data: data
        });
    });


    // socket.on("boardSensor", function (data) {
    //     console.log('boardSensor', data);

    //     io.sockets.emit('logMessage', {
    //         dateTime: Date.now(),
    //         data: data
    //     });
    // });

    // When we receive a message...
    socket.on("pushButton", function (data) {
        console.log('pushButton', data);
        io.sockets.emit('logMessage', {
            dateTime: Date.now(),
            data: data
        });
    });


});