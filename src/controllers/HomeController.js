
const Room = require('./../models/Room');

class HomeController {
   async  index(req, res) {
        let user = null;
        let rooms = [];
        if (req.session) {
            user = req.session;
            var creator =  user.user ?? null;
            if (creator) {
                rooms = await Room.find({ creator: creator._id });                
            }
        }
        res.render('home/index', { user, rooms })
    }
     getRoomsByCreatorId = async(creatorId) => {
        try {
            const rooms = await Room.find({ creator: creatorId });
            return rooms;
        } catch (error) {
            console.error('Error al obtener las habitaciones:', error);
            throw error;
        }
    }
}

module.exports = new HomeController();