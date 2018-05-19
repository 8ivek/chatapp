//var app = require('express')();
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var path = require('path');

// Server start
http.listen(port ,function(){
    console.log('Server listening at port %d', port);
});

// Routing
app.get('/',function(req,res){
    app.use(express.static('public'));
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

// chatroom
var numUsers = 0;
var users = {};

io.on('connection', function(socket){
    var addedUser = false;

    // when the client emits 'add_user', this listens and executes
    socket.on('add_user',function(username){
        if (addedUser) return;

        // we store the username in the socket session for this client
        socket.username = username;
        users[socket.id] = username;
        numUsers++;
        addedUser = true;
        socket.emit('login', {users,numUsers});
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user_joined', {users,numUsers});
    });

    // when the user disconnects.. perform this
    socket.on('disconnect',function(){
        if (addedUser) {
            delete users[socket.id];
            numUsers--;

            // echo globally that this client has left
            socket.broadcast.emit('user_left', {users,numUsers});
        }
    });

    socket.on('chat_message', function(data){
        socket.emit('new_message', {usr:socket.username,msg:data.msg});
        socket.broadcast.emit('new_message', {usr:socket.username,msg:data.msg});
    });
});