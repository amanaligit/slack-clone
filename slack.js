const express = require('express');
const app = express();
const socketio = require('socket.io')
let namespaces = require('./data/namespaces')
// console.log(namespaces[0]);
app.use(express.static(__dirname + '/public'));



const expressServer = app.listen(9000);
const io = socketio(expressServer);


// io.on = io.of('/').on
io.on('connection', (socket) => {
    // console.log(socket.handshake)
    let nsData = namespaces.map(ns => {
        return {
            img: ns.img,
            endpoint: ns.endpoint
        }
    })
    // console.log(nsData);
    socket.emit('nsList', nsData);

})

namespaces.forEach(namespace => {
    io.of(namespace.endpoint).on('connection', nsSocket => {
        console.log(nsSocket.handshake);
        const username = nsSocket.handshake.query.username;
        console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);
        nsSocket.emit('nsRoomsLoad', namespace.rooms);
        nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallback) => {
            // console.log(nsSocket.rooms);
            const roomToLeave = Object.keys(nsSocket.rooms)[1];
            nsSocket.leave(roomToLeave);
            updateUsersInRoom(namespace, roomToLeave);
            nsSocket.join(roomToJoin);
            io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) => {
                // console.log(clients.length);
                numberOfUsersCallback(clients.length);
            })
            const nsRoom = namespace.rooms.find(room => room.roomTitle === roomToJoin);
            // console.log(nsRoom.history);
            nsSocket.emit('historyCatchUp', nsRoom.history);
            updateUsersInRoom(namespace, roomToJoin);
        })
        nsSocket.on('newMessageToServer', msg => {
            // console.log(msg);
            const fullMsg = {
                text: msg.text,
                time: Date.now(),
                username: username,
                avatar: 'https://via.placeholder.com/30'
            }
            //send this message to all the sockets 
            // console.log(nsSocket.rooms)
            const roomTitle = Object.keys(nsSocket.rooms)[1];
            // console.log(roomTitle);
            const nsRoom = namespace.rooms.find(room => room.roomTitle === roomTitle);
            // console.log(nsRoom);
            nsRoom.addMessage(fullMsg);
            io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg)
        })
    })
})

function updateUsersInRoom(namespace, roomToJoin) {
    io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) => {
        // console.log(`There are ${clients.length} in this room`);
        io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', clients.length);
    })
}