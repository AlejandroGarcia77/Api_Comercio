const express = require('express');
const {validatorGet,validatorCreate,validatorUpdate,validatorDelete} = require('../validators/comercios');
const {mostrarComercios,mostrarComercio,crearComercio,actualizarComercio,eliminarComercio} = require('../controllers/comercios');
const { authMiddleware } = require('../middleware/session');
const checkRol = require('../middleware/rol');



const router = express.Router();

router.get('/',authMiddleware,checkRol(["admin"]),mostrarComercios)
router.get('/:CIF',authMiddleware,checkRol(["admin"]),validatorGet,mostrarComercio)
router.post('/',authMiddleware,checkRol(["admin"]),validatorCreate,crearComercio)
router.put('/:CIF',authMiddleware,checkRol(["admin"]),validatorUpdate,actualizarComercio)
router.delete('/:CIF',authMiddleware,checkRol(["admin"]),validatorDelete,eliminarComercio)

module.exports = router;