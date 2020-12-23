const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set('view engine','ejs');

app.locals.users = [];

app.get('/', function(req, res) {
    res.render('index');
});

io.sockets.on('connection', function(socket) {
    
    socket.on('username', function(username) {
        app.locals.users.push(username);
        console.log(app.locals.users);
        socket.username = username;
        io.emit('usersEvent',app.locals.users);
        io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
        
    });

    socket.on('disconnect', function(username) {
        
        var index = app.locals.users.indexOf(username);
        app.locals.users.splice(index, 1);
        
        io.emit('usersEvent',app.locals.users);
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

});

const server = http.listen(8080, function() {
    console.log('listening on *:8080');
});