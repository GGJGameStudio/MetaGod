﻿/// <reference path="Scripts/typings/socket.io/socket.io.d.ts" />

import socket = require('socket.io');
import W = require('./Core/World');
import C = require('./Core/Commands');
import Dto = require('./Core/Transfer');
import V = require('./Utils/Variables');

console.log('Starting Server');
console.log('---------------');
console.log();

console.log('Creating world');

var world = W.World.Instance;

console.log('World created');

console.log('---------------');
console.log();

var server_io = socket.listen(1337);

console.log('Server listening on port 1337');
console.log('---------------');
console.log();

//Connection from client
server_io.on('connection', function (server_socket) {

    console.log("[SERVER] Player joined : " + server_socket.id);

    server_socket.on('update', function (data) {
        var params = new Array();
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                params.push(key + " -> " + data[key]);
            }
        }

        console.log("[SERVER] Player " + server_socket.id + " used a command:" + params.join(" | "));

        var cmd = C.getCommand(data, server_socket.id);

        if (cmd.CanRun())
            cmd.Run();
    });

    server_socket.on('disconnect', function () {
        console.log("[SERVER] Player disconnected : " + server_socket.id);
        world.removePlayer(server_socket.id);
    });

    world.addPlayer(server_socket.id);

    server_socket.emit("acquittal", server_socket.id);

    server_socket.emit("init", new Dto.WorldDto(world, true));
});

var lastUpdate: number = Date.now();
var elapsed = 0;
var elapsedSinceLastNotify = 0;

// Update loop
setInterval(function () {

    // Calculate elapsed time since last update
    var now = Date.now();
    elapsed = now - lastUpdate;
    lastUpdate = now;
    elapsedSinceLastNotify += elapsed;

    // Updare model
    world.Update(elapsed);

    // Notify players
    if (elapsedSinceLastNotify >= V.Variables.clientNotifyRate) {
        server_io.emit('status', new Dto.WorldDto(world));
        world.resetUpdatedTile();
        elapsedSinceLastNotify -= V.Variables.clientNotifyRate;
    }
}, V.Variables.serverUpdateRate);
