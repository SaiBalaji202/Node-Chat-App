
const path = require("path");
const http = require("http");

const express = require("express");

const socketIO = require("socket.io");

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server); // Returns web socket server
var users = new Users();

const publicPath = path.join(__dirname, '/../public');
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    // console.log('New User gets Connected');
    
    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Enter your Name and Room Name');
        }
        console.log(`${params.name} Connected`);
        
        socket.join(params.room); // Join user to the room
        users.removeUser(socket.id); // Check and Remove the user from any other room 
        users.addUser(socket.id, params.name, params.room); // Add a user to the users list
        io.to(params.room).emit('updateUserList', users.getUserList(params.room)); // Emit a new user to all users on the room

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to Chat App!'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined!`));  
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        // console.log(`createMessage request from ${user.name}`);       
        var user = users.getUser(socket.id);
        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }            
        callback('Data Received by Server!');
    });

    socket.on('creationLocationMessage', (coords) => {
        var user = users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }        
    });

    socket.on('disconnect', () => {        
        var user = users.getUser(socket.id);
        if(user) {
            users.removeUser(user.id);
            console.log(`${user.name} Disconnected`);
            io.to(user.room).emit('updateUserList', users.getUserList(user.room)); // Inform about the updated user list to all users on the room
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`)); // Notify all users in the room with the text message about the user left the group
        }
    });
});
server.listen(port, () => {
    console.log(`Server Started at ${port}`);
});
