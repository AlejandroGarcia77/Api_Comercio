const express = require('express');
const {mostrarUsuarios,crearUsuarios, actualizarUsuarios, eliminarUsuarios} = require('../controllers/usuarios');
const {validatorGet,validatorCreate, validatorUpdate, validatorDelete} = require('../validators/usuarios');
const { authMiddleware } = require('../middleware/session');
const checkRol = require('../middleware/rol');
const router = express.Router();



router.get('/',authMiddleware,checkRol(["comercio"]),validatorGet,mostrarUsuarios);
router.post('/',validatorCreate,crearUsuarios);
router.put('/',authMiddleware,checkRol(["usuario_registrado","admin"]),validatorUpdate,actualizarUsuarios);
router.delete('/',authMiddleware,checkRol(["usuario_registrado","admin"]),validatorDelete,eliminarUsuarios)

module.exports = router;