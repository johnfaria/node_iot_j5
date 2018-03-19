'use strict'
var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io").listen(server);
var five = require("johnny-five");

var board = new five.Board();
var photoresistor,potentiometer, cont = 1;
//---------------------------------------------------------------------------------

board.on("ready", function() {
    
  // Create a new `photoresistor` hardware instance.
    photoresistor = new five.Sensor({
    pin: "A2",
    freq: 1000 // 1 segundo 
    });
  // Inject the `sensor` hardware into
  // the Repl instance's context;
  // allows direct command line access
    board.repl.inject({
      pot: photoresistor,
    });

  // "data" get the current reading from the photoresistor
  photoresistor.on("data", function() {
    io.sockets.emit('leit_lum',this.value);
  });

});

//---------------------------------------------------------------------------------
io.on("connection",function(socket){
    console.log("Ocorreu uma conexão id = "+cont);
    cont++;
});

app.use(express.static(__dirname + '/'));

app.get('/',function (req, res) {
  res.sendFile(__dirname+'/index.html');
})

server.listen(8000, function () {
  console.log('Servidor porta 8000');
})

//---------------------------------------------------------------------------------