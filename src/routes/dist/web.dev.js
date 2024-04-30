"use strict";

var express = require('express');

var parseContentTypeMiddleware = require('../middlewares/parseContentTypeMiddleware');

var authMiddleware = require('../middlewares/authMiddleware');

var HomeController = require('../controllers/HomeController');

var RoomController = require('../controllers/RoomController');

var AuthController = require('../controllers/AuthController');

var middlewares = [parseContentTypeMiddleware, authMiddleware];
var router = express.Router();
router.get('/', middlewares, HomeController.index);
router.get('/home', middlewares, HomeController.index);
router.get("/shared", middlewares, HomeController.getRoomsShared);
router.get('/room/:roomID', middlewares, RoomController.index);
router.post('/room/new', middlewares, RoomController.newRoom);
router.post('/room/join', middlewares, RoomController.joinRoom);
router.get('/room/lobby', middlewares, RoomController.lobby);
router.post('/room/save', RoomController.save);
router.post('/room/export', RoomController["export"]);
router.post('/room/gen_code', RoomController.genCode);
router.post('/room/add_colab', middlewares, RoomController.addColab);
router.get('/login', parseContentTypeMiddleware, AuthController.login);
router.post('/auth/login', parseContentTypeMiddleware, AuthController.verify);
router.get('/register', parseContentTypeMiddleware, AuthController.register);
router.post('/auth/register', parseContentTypeMiddleware, AuthController.save);
router.get('/logout', parseContentTypeMiddleware, AuthController.logout);
router.post('/file', parseContentTypeMiddleware, RoomController.save);
router.use('*', function (req, res) {
  res.render('404');
});
module.exports = router;