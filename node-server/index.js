const express = require('express');
const serverless = require('serverless-http');
const { Server } = require('socket.io');
const app = express();

const server = app.listen(3000, "0.0.0.0");
const io = new Server(server, { cors: { origin: '*' } });
const users = {};

io.on('connection', socket => {
    //  If any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends a message, broadcast it to other people!
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id]});
    });

    // If someone sends a message, let others know!
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});

module.exports.handler = serverless(app);