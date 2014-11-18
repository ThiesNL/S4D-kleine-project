// remoteServer.js
var express = require("express"),
    app = express(),
    server = require("http").createServer(app),
    io = require("socket.io").listen(server),
    port = 3001;

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

server.listen(port, function () {
    console.log('Listening on port ' + port);
});

io.sockets.on("connection", function (socket) {

	socket.on("ledOn", function (data) {
   		console.log('ledOn');
     	io.sockets.emit("ledOn");
    });

   	socket.on("ledOff", function (data) {
   		console.log('ledOff');
     	io.sockets.emit("ledOff");
    });


	socket.on("potmeter", function (data) {
        console.log('potmeter', data);
        io.sockets.emit("potmeter", data);
    });    
});