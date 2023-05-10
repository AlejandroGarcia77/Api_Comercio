const express = require('express');
const {mostrarPaginas,crearPagina,actualizarPagina,eliminarPagina, añadirFoto,actualizarFoto,añadirTexto,actualizarTexto,buscarPaginas,buscarPaginasActividad,actualizarReseña, mostrarPagina} = require('../controllers/paginas');
const {validatorCreate,validatorUpdate,validatorDelete,validatorActualizarFoto,validatorCrearTexto,validatorActualizarTexto, validatorObtenerPaginas, validatorObtenerPaginasActividad,validatorActualizarReseña, validatorObtenerPagina, validatorCrearFoto} = require('../validators/paginas');
const comprobarTexto = require('../validators/comprobarTexto');
const comprobarImagen = require('../validators/comprobarImagen');
const comprobarActividad = require('../validators/comprobarActividad');
const { authMiddleware } = require('../middleware/session');
const uploadMiddleware = require("../utils/handleStorage");
const checkRol = require('../middleware/rol');
const router = express.Router();

//*Rutas de acceso a la pagina
router.get('/',mostrarPaginas)
router.get('/:titulo',validatorObtenerPagina,mostrarPagina)
router.get('/buscar/:ciudad',validatorObtenerPaginas,buscarPaginas)
router.get('/buscar/:ciudad/:actividad',validatorObtenerPaginasActividad,comprobarActividad,buscarPaginasActividad)
router.post('/',authMiddleware,checkRol(["comercio"]),validatorCreate,crearPagina)
router.put('/',authMiddleware,checkRol(["comercio"]),validatorUpdate,actualizarPagina)
router.delete('/',authMiddleware,checkRol(["comercio"]),validatorDelete,eliminarPagina)


//*Rutas de acceso a los elementos de la pagina
router.post('/foto',authMiddleware,checkRol(["comercio"]),validatorCrearFoto,uploadMiddleware.single("image"),añadirFoto)
router.put('/foto/:id',authMiddleware,checkRol(["comercio"]),validatorActualizarFoto,comprobarImagen,uploadMiddleware.single("image"),actualizarFoto)

router.post('/texto',authMiddleware,checkRol(["comercio"]),validatorCrearTexto,añadirTexto)
router.put('/texto/:id',authMiddleware,checkRol(["comercio"]),validatorActualizarTexto,comprobarTexto,actualizarTexto)

router.patch('/:titulo',authMiddleware,checkRol(["usuario_registrado"]),validatorActualizarReseña,actualizarReseña)



module.exports = router;