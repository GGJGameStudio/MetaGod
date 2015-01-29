/// <reference path="Scripts/typings/socket.io/socket.io.d.ts" />

import socket = require('socket.io');
import W = require('./Core/World');
import T = require('./Core/Tiles');
import C = require('./Core/Commands');
import V = require('./Utils/Variables');

console.log('Starting Server');
console.log('---------------');

var server_io = socket.listen(1337);

console.log('Server listening on port 1337');

// Get World singleton
var world = W.World.Instance;

//Connection from client
server_io.on('connection', function (server_socket) {

    console.log("[SERVER] Player joined : " + server_socket.id);

    server_socket.emit("acquittal", server_socket.id);

    server_socket.on('update', function (data) {
        console.log("[SERVER] Player " + server_socket.id + " used a command :" + data.command +" with param: " + data);
        var cmd = C.getCommand(data, server_socket.id);

        if (cmd.CanRun())
            cmd.Run();
    });

    server_socket.on('disconnect', function () {
        console.log("[SERVER] Player disconnected : " + server_socket.id);
        world.removePlayer(server_socket.id);
    });
});

var lastUpdate: number = Date.now();
var elapsed = 0;

// Update loop
setInterval(function () {

    // Calculate elapsed time since last update
    var now = Date.now();

    elapsed = now - lastUpdate;
    lastUpdate = now;

    // Updare model
    world.Update(elapsed);

    // Notify players
    server_io.emit('status', world);
}, V.Variables.updateRate);
