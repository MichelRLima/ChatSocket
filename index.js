const app = require('express')();

const http = require('http').createServer(app);

const io = require('socket.io')(http);





var usuarios = [];

var socketIds = [];





app.get('/', (req, res) => {

    res.sendFile(__dirname + '/index.html');

});



io.on('connection', (socket) => {



    socket.on('new user', function (data) {

        if (usuarios.indexOf(data) !== -1) {

            socket.emit('new user', { success: false, message: 'Já existe um usuário com este nome.' });

        } else {

            usuarios.push(data);

            socketIds.push(socket.id);

            socket.broadcast.emit('new user', { success: true, message: data + ' entrou no chat.' });

            socket.emit('new user', { success: true, message: 'Bem-vindo ao chat, ' + data });

            //Emit para os outros usuários dizendo que tem um novo usuário ativo.

            //socket.broadcast.emit("hello", "world");

        }

    })




    socket.on('chat message', (obj) => {

        io.emit('chat message', obj);



    })



    socket.on('disconnect', () => {
        let id = socketIds.indexOf(socket.id);
        if (id !== -1) {
            let disconnectedUser = usuarios[id];
            socketIds.splice(id, 1);
            usuarios.splice(id, 1);
            console.log(socketIds);
            console.log(usuarios);
            console.log(disconnectedUser + ' disconnected');
            socket.broadcast.emit('new user', { success: true, message: disconnectedUser + ' saiu do chat', desconect: true });
        }
    });




})



http.listen(3001, () => {

    console.log('listening on *:3001');

});