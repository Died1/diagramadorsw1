"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var multer = require("multer"); // Importa Multer


var path = require("path");

var Handlebars = require("handlebars"); // Helper personalizado para JSON.stringify


Handlebars.registerHelper("stringify", function (context) {
  return JSON.stringify(context);
});

var Room = require("../models/Room");

var User = require("../models/User");

var RoomController =
/*#__PURE__*/
function () {
  function RoomController() {
    _classCallCheck(this, RoomController);
  }

  _createClass(RoomController, [{
    key: "index",
    value: function index(req, res) {
      var roomID, user, room, users, isMember;
      return regeneratorRuntime.async(function index$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              roomID = req.params.roomID;
              user = null;

              if (req.session) {
                user = req.session;
              }

              _context.prev = 3;
              _context.next = 6;
              return regeneratorRuntime.awrap(Room.findOne({
                _id: roomID
              }).exec());

            case 6:
              room = _context.sent;
              _context.next = 9;
              return regeneratorRuntime.awrap(User.find().exec());

            case 9:
              users = _context.sent;

              if (room) {
                _context.next = 12;
                break;
              }

              return _context.abrupt("return", res.render("room/404"));

            case 12:
              //buscar si es tiene permiso
              isMember = room.members.some(function (member) {
                return member.email === user.user.email;
              });

              if (isMember) {
                res.render("room/editor", {
                  data: room,
                  user: user,
                  users: users
                });
              } else {
                res.render("room/401");
              }

              _context.next = 20;
              break;

            case 16:
              _context.prev = 16;
              _context.t0 = _context["catch"](3);
              console.error("Error al buscar la sala:", _context.t0);
              return _context.abrupt("return", res.status(500).send("Error al buscar la sala"));

            case 20:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[3, 16]]);
    }
  }, {
    key: "joinRoom",
    value: function joinRoom(req, res) {
      var roomID = req.body.name;
      res.redirect("/room/".concat(roomID));
    }
    /* newRoom(req, res) {
          const roomID = Math.random().toString(36).substring(2);
          res.redirect(`/room/${roomID}`);
      }
    */

  }, {
    key: "newRoom",
    value: function newRoom(req, res) {
      var userId = req.user._id;
      var userEmail = req.user.email; // Obtener el email del usuario creador

      var data = _objectSpread({}, req.body, {
        creator: userId,
        members: [{
          email: userEmail,
          role: "PROPIETARIO",
          key: "UNIQUE_KEY"
        }]
      }); // Agregar el email del creador como miembro con rol de "propietario"
      // Crear una nueva instancia de la sala sin proporcionar un ID


      var room = new Room(data); // Guardar la sala en la base de datos

      room.save().then(function (savedRoom) {
        // Redirigir al usuario a la página de la nueva sala con el ID generado por Mongoose
        res.redirect("/room/".concat(savedRoom._id));
      })["catch"](function (error) {
        // Manejar cualquier error que ocurra durante el proceso de guardado
        console.error("Error al crear la sala:", error); // Redirigir al usuario a una página de error o realizar otra acción apropiada

        res.status(500).send("Error al crear la sala");
      });
    }
  }, {
    key: "lobby",
    value: function lobby(req, res) {
      res.render("room/lobby");
    }
  }, {
    key: "save",
    value: function save(req, res) {
      console.log("save");

      try {
        var storage = multer.diskStorage({
          destination: function destination(req, file, cb) {
            cb(null, "uploads/");
          },
          filename: function filename(req, file, cb) {
            var uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            var extname = path.extname(file.originalname);
            cb(null, uniqueSuffix + extname);
          }
        });
        var upload = multer({
          storage: storage
        });
        upload.single("file")(req, res, function (err) {
          if (err instanceof multer.MulterError) {
            return res.status(400).json({
              error: "Error al cargar la foto"
            });
          } else if (err) {
            return res.status(500).json({
              error: "Error interno del servidor"
            });
          }

          var photo = req.file; // Accede al archivo cargado usando req.file

          if (!photo) {
            return res.status(400).json({
              error: "No se ha cargado ninguna foto"
            });
          }

          var originalname = photo.originalname;
          var mimetype = photo.mimetype;
          var size = photo.size; // Aquí puedes procesar la foto cargada, guardarla en el sistema de archivos o en una base de datos, etc.

          return res.status(200).json({
            message: "Foto cargada exitosamente",
            originalname: originalname,
            mimetype: mimetype,
            size: size
          });
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, {
    key: "export",
    value: function _export(req, res) {
      var filePath = path.join("archivos/", "Dibujo1.png.xml"); // Utiliza el método res.download() para enviar el archivo como respuesta

      res.download(filePath, "Dibujo1.png.xml", function (error) {
        if (error) {
          // Maneja errores, si los hay
          console.error("Error al descargar el archivo:", error);
          res.status(500).send("Error al descargar el archivo");
        }
      });
    }
  }, {
    key: "genCode",
    value: function genCode(req, res) {
      res.render("room/lobby");
    }
  }, {
    key: "find",
    value: function find() {
      return regeneratorRuntime.async(function find$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
  }, {
    key: "addColab",
    value: function addColab(req, res) {
      var roomId, colabs, room;
      return regeneratorRuntime.async(function addColab$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              roomId = req.body.room_id;
              colabs = req.body.colaboradores;
              _context3.prev = 2;
              _context3.next = 5;
              return regeneratorRuntime.awrap(Room.findOne({
                _id: roomId
              }).exec());

            case 5:
              room = _context3.sent;
              colabs.forEach(function (userId) {
                var existe = room.members.some(function (member) {
                  return member.email === userId;
                });

                if (!existe) {
                  //Si el usuario no es miembro, agrégalo a la lista de miembros
                  room.members.push({
                    email: userId,
                    role: "EDITOR",
                    key: "UNIQUE_KEY"
                  }); // Guarda los cambios en la base de datos

                  room.save().then(function (savedRoom) {})["catch"](function (error) {
                    // Manejar cualquier error que ocurra durante el proceso de guardado
                    console.error("Error al crear la sala:", error); // Redirigir al usuario a una página de error o realizar otra acción apropiada

                    res.status(500).send("Error al crear la sala");
                  });
                }

                return res.status(200).send("success");
              });
              _context3.next = 12;
              break;

            case 9:
              _context3.prev = 9;
              _context3.t0 = _context3["catch"](2);
              console.log(_context3.t0);

            case 12:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[2, 9]]);
    }
  }]);

  return RoomController;
}();

module.exports = new RoomController();