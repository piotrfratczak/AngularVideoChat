const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
// const { ExpressPeerServer } = require('peer');

const app = express();
const server = http.Server(app);
const io = socketIO(server);
// const peerServer = ExpressPeerServer(server, {
// 	path: __dirname + '/../client/dist/angular-chat'
// });

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/../client/dist/angular-chat'));
// app.use('/peerjs', peerServer);

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname+'/../client'));
});

io.on('connection', socket => {
	console.log('new user connected');

	socket.on('join-room', userId => {
		console.log('user ' + userId + ' joined');
		socket.broadcast.emit('user-joined', userId);

		socket.on('disconnect', () => {
			socket.broadcast.emit('user-left', userId);
		});
	});
});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});