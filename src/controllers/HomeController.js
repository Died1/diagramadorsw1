const Room = require("./../models/Room");

class HomeController {
  async index(req, res) {
    let user = null;
    let rooms = [];
    if (req.session) {
      user = req.session;
      var creator = user.user ?? null;
      if (creator) {
        rooms = await Room.find({ creator: creator._id });
      }
    }
    res.render("home/index", { user, rooms });
  }
  getRoomsByCreatorId = async (creatorId) => {
    try {
      const rooms = await Room.find({ creator: creatorId });
      return rooms;
    } catch (error) {
      console.error("Error al obtener las habitaciones:", error);
      throw error;
    }
  };

  async getRoomsShared(req, res) {
    try {
      let user = null;
      let rooms = [];
      if (req.session) {
        user = req.session;
        var creator = user.user ?? null;
        if (creator.email) {
            rooms = await Room.find({
              creator: { $ne: creator._id },
              "members.email": creator.email,
            });
        }
      }
       res.render("home/shared", { user, rooms });
    } catch (error) {
      console.error("Error al obtener las habitaciones:", error);
      throw error;
    }
  }
}

module.exports = new HomeController();
