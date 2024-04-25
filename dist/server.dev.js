"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var express = require('express');

var cors = require('cors');

var session = require('express-session');

var _require = require('./src/config/config'),
    env = _require.env;

var _require2 = require('./src/sockets/controller'),
    socketController = _require2.socketController;

var Server =
/*#__PURE__*/
function () {
  function Server() {
    var _this = this;

    _classCallCheck(this, Server);

    this.app = express();
    this.app.use(cors());
    this.app.use(session({
      resave: false,
      saveUninitialized: true,
      secret: 'cat',
      cookie: {
        maxAge: 864000000
      }
    }));

    var hbs = require('hbs');

    this.app.set('view engine', 'hbs');
    this.app.set("views", __dirname + "/src/views");
    this.app.use(express["static"](__dirname + "/public"));
    this.server = require('http').createServer(this.app);
    this.io = require('socket.io')(this.server); // Rutas de mi aplicación

    this.app.use('/', require('./src/routes/web')); //sockets        

    this.io.on('connection', function (socket) {
      socketController(socket, _this.io);
    });
  }

  _createClass(Server, [{
    key: "listen",
    value: function listen() {
      this.server.listen(env.PORT, function () {
        console.log('Servidor corriendo en puerto', env.PORT);
      });
    }
  }]);

  return Server;
}();

module.exports = Server;