const express = require('express');
const parseContentTypeMiddleware = require('../middlewares/parseContentTypeMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

const HomeController = require('../controllers/HomeController');
const RoomController = require('../controllers/RoomController');
const AuthController = require('../controllers/AuthController');
const middlewares = [
    parseContentTypeMiddleware,
    authMiddleware,
];

const router = express.Router();

router.get('/',  middlewares, HomeController.index);
router.get('/home', middlewares, HomeController.index);
router.get('/room/:roomID', middlewares, RoomController.index);
router.post('/room/new', middlewares, RoomController.newRoom);
router.post('/room/join', middlewares, RoomController.joinRoom);
router.get('/room/lobby', middlewares, RoomController.lobby);
router.post('/room/save',  RoomController.save);
router.post('/room/export', RoomController.export);
router.post('/room/gen_code',  RoomController.genCode);
router.post('/room/add_colab', middlewares, RoomController.addColab)
router.get('/login', parseContentTypeMiddleware, AuthController.login);
router.post('/auth/login', parseContentTypeMiddleware, AuthController.verify);
router.get('/register', parseContentTypeMiddleware, AuthController.register);
router.post('/auth/register', parseContentTypeMiddleware, AuthController.save);
router.get('/logout', parseContentTypeMiddleware, AuthController.logout);
router.post('/file', parseContentTypeMiddleware, RoomController.save);
router.use('*', function (req, res) {
    res.render('404')
});

module.exports = router;