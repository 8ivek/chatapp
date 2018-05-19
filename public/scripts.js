$(function () {
    var socket = io();
    var users;
    $('div#room form#msg').submit(function(){
        socket.emit('chat_message', {msg:$('#m').val()});
        $('#m').val('');
        return false;
    });
    $('div#login form').submit(function(){
        socket.emit('add_user', $('#nick').val());
        $('#nick').val('');
        return false;
    });
    socket.on('login',function(data){
        $('#login').hide();
        $('#room').show();
        users=data.users;
    });
    socket.on('user_joined',function(data){
        users=data.users;
    });
    socket.on('user_left',function(data){
        users=data.users;
    });
    socket.on('new_message', function(msg){
        $('#messages').append($('<li>').text(msg.usr+': '+msg.msg));
        window.scrollTo(0, document.body.scrollHeight);
    });
});