const express = require('express');
const cors = require('cors');
var session = require('express-session');
const { env } = require('./src/config/config');
const { socketController } = require('./src/sockets/controller');

class Server {
    constructor() {
        this.app = express();
        this.app.use(cors());
        this.app.use(session({
            resave: false,
            saveUninitialized: true,
            secret: 'cat',
            cookie: { maxAge: 864000000 }
        }));
        const hbs = require('hbs');
        this.app.set('view engine', 'hbs');
        this.app.set("views", __dirname + "/src/views");
        this.app.use(express.static(__dirname + "/public"));
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server)
        // Rutas de mi aplicación
        this.app.use('/', require('./src/routes/web'));
        //sockets        
        this.io.on('connection', (socket) => {
            socketController(socket, this.io);
        });
    }
    listen() {
        this.server.listen(env.PORT, () => {
            console.log('Servidor corriendo en puerto', env.PORT);
        });
    }
}
module.exports = Server;
