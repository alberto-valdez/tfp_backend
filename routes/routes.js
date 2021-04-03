'use strict'

var express = require('express');
var controller = require ('../controllers/controller');
var router = express.Router();
var multipart = require('connect-multiparty');
var mdUpload = multipart({uploadDir: './multimedia/post'});
var mdUploadArtista = multipart({uploadDir: './multimedia/artista'});
var mdUploadAlbum = multipart({uploadDir: './multimedia/album'});

var podcastController = require('../controllers/podcastController');
var artistaController = require('../controllers/artistaController');
var albumController = require('../controllers/albumController');
var contactoController = require('../controllers/contacto');
var userController = require('../controllers/userController');



router.get('/test', controller.test);
router.post('/newPost', controller.savePost);
router.get('/posts/:last?', controller.getPosts);
router.get('/getPost/:id', controller.getPost);
router.put('/updatePost/:id', controller.updatePost);
router.delete('/deletePost/:id', controller.deletePost);
router.post('/uploadImagePost/:id', mdUpload, controller.uploadImage);
router.get('/getImagePost/:image', controller.getImage);
router.get('searchPost/:search', controller.searchPost);


//eventos
router.post('/newEvento', controller.crearEvento);
router.get('/getEvento/:last?', controller.getEventos);



//podcast 
router.post('/addPodcast', podcastController.savePodcast);
router.get('/getPod/:id', podcastController.getPod);
router.get('/getPodcast/:last?', podcastController.getPodcast);
router.put('/editPodcast/:id', podcastController.editPodcast);
router.delete('/deletePodcast/:id', podcastController.deletePodcast);

//artista 
router.post('/addArtista', artistaController.saveArtista);
router.put('/editArtista/:id', artistaController.editArtista);
router.get('/getArtistas', artistaController.getArtistas);
router.get('/getArtista/:id', artistaController.getArtista);
router.delete('/deleteArtista/:id', artistaController.deleteArtist);
router.post('/uploadImageArtista/:id', mdUploadArtista, artistaController.uploadImage);
router.get('/getImageArtista/:image', artistaController.getImage);


//album
router.post('/addAlbum', albumController.saveAlbum);
router.put('/editAlbum/:id', albumController.editAlbum);
router.get('/getAlbums/:id', albumController.getAlbums);
router.get('/getAlbum/:id', albumController.getAlbum);
router.get('/lastAlbum/:last', albumController.getLastAlbum);
router.delete('/deleteAlbum/:id', albumController.deleteAlbum);
router.post('/uploadImageAlbum/:id', mdUploadAlbum, albumController.uploadImage);
router.get('/getImageAlbum/:image', albumController.getImageAlbum);

router.post('/contactar', contactoController.createContacto);
router.get('/contactos', contactoController.getContactos);
router.delete('/deleteContacto/:id', contactoController.deleteContacto);

router.post('/addUser', userController.saveUser);
router.post('/login', userController.getUser);

module.exports = router;
