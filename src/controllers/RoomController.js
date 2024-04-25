const multer = require("multer"); // Importa Multer
const path = require("path");
const Handlebars = require("handlebars");

// Helper personalizado para JSON.stringify
Handlebars.registerHelper("stringify", function (context) {
  return JSON.stringify(context);
});

const Room = require("../models/Room");
const User = require("../models/User");

class RoomController {

  async index(req, res) {
    const { roomID } = req.params;
    let user = null;    
    if (req.session) {
      user = req.session;
    }
    try {
      const room = await Room.findOne({ _id: roomID }).exec();
      const users = await User.find().exec();      
      // Verificar si se encontró la sala
      if (!room) {
        // Si no se encontró la sala, puedes manejarlo de acuerdo a tus necesidades
        return res.render("room/404");
      }

      //buscar si es tiene permiso
      let isMember = room.members.some((member) => member.email === user.user.email);
      if(isMember){
          res.render("room/editor", { data: room, user, users });
      }else{
          res.render("room/401");
      }
    } catch (error) {
      console.error("Error al buscar la sala:", error);
      return res.status(500).send("Error al buscar la sala");
    }
  }

  joinRoom(req, res) {
    const { name: roomID } = req.body;
    res.redirect(`/room/${roomID}`);
  }

  /* newRoom(req, res) {
        const roomID = Math.random().toString(36).substring(2);
        res.redirect(`/room/${roomID}`);
    }
 */
  newRoom(req, res) {
    const userId = req.user._id;
    const userEmail = req.user.email; // Obtener el email del usuario creador
    const data = { ...req.body, creator: userId, members: [{ email: userEmail, role: "PROPIETARIO", key: "UNIQUE_KEY" }] }; // Agregar el email del creador como miembro con rol de "propietario"
    // Crear una nueva instancia de la sala sin proporcionar un ID
    const room = new Room(data);

    // Guardar la sala en la base de datos
    room
      .save()
      .then((savedRoom) => {
        // Redirigir al usuario a la página de la nueva sala con el ID generado por Mongoose
        res.redirect(`/room/${savedRoom._id}`);
      })
      .catch((error) => {
        // Manejar cualquier error que ocurra durante el proceso de guardado
        console.error("Error al crear la sala:", error);
        // Redirigir al usuario a una página de error o realizar otra acción apropiada
        res.status(500).send("Error al crear la sala");
      });
  }

  lobby(req, res) {
    res.render("room/lobby");
  }

  save(req, res) {
    console.log("save");
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "uploads/");
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extname = path.extname(file.originalname);
        cb(null, uniqueSuffix + extname);
      },
    });

    const upload = multer({ storage: storage });
    upload.single("file")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: "Error al cargar la foto" });
      } else if (err) {
        return res.status(500).json({ error: "Error interno del servidor" });
      }
      const photo = req.file; // Accede al archivo cargado usando req.file
      if (!photo) {
        return res.status(400).json({ error: "No se ha cargado ninguna foto" });
      }
      const originalname = photo.originalname;
      const mimetype = photo.mimetype;
      const size = photo.size;
      // Aquí puedes procesar la foto cargada, guardarla en el sistema de archivos o en una base de datos, etc.
      return res.status(200).json({
        message: "Foto cargada exitosamente",
        originalname,
        mimetype,
        size,
      });
    });
  }

  export(req, res) {
    const filePath = path.join("archivos/", "Dibujo1.png.xml");

    // Utiliza el método res.download() para enviar el archivo como respuesta
    res.download(filePath, "Dibujo1.png.xml", (error) => {
      if (error) {
        // Maneja errores, si los hay
        console.error("Error al descargar el archivo:", error);
        res.status(500).send("Error al descargar el archivo");
      }
    });

  }

  genCode(req, res) {
    res.render("room/lobby");
  }

  async find() {}

  async addColab(req, res) {
    let roomId = req.body.room_id;
    let colabs = req.body.colaboradores;
    try {
      const room = await Room.findOne({ _id: roomId }).exec();

      colabs.forEach((userId) => {
        var existe = room.members.some((member) => member.email === userId);
        if (!existe) {
             //Si el usuario no es miembro, agrégalo a la lista de miembros
        room.members.push({
            email: userId,
            role: "EDITOR",
            key: "UNIQUE_KEY",
          });
  
          // Guarda los cambios en la base de datos
          room
            .save()
            .then((savedRoom) => {
  
            })
            .catch((error) => {
              // Manejar cualquier error que ocurra durante el proceso de guardado
              console.error("Error al crear la sala:", error);
              // Redirigir al usuario a una página de error o realizar otra acción apropiada
              res.status(500).send("Error al crear la sala");
            });
        }
        return res.status(200).send("success");
       
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new RoomController();
