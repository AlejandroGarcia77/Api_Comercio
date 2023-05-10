const { body,param,check } = require('express-validator');
const validateResults = require('../utils/handleValidator');
const {paginasModelo} = require('../models');




const validatorCreate = [

  body('usuario').exists().withMessage('Usuario es necesario').bail()
  .custom(
    async (value) => {
      //*Comprobamos que no tenga una pagina registrada
      const pagina = await paginasModelo.findOne({ email_propietario: value.email });
      if (pagina) {
        throw new Error(value.email+' tiene una pagina registrada');
      }
    }
    ).bail(),

  

  body('titulo').exists().notEmpty().withMessage('El título es requerido').bail()
    .isLength({ max: 50 }).withMessage('El título no puede tener más de 50 caracteres')
    .custom(async (value) => {
      //*Comprobamos que sea único
      const pagina = await paginasModelo.findOne({ titulo: value });
      if (pagina) {
        throw new Error('El título ya existe');
      }
    }),
  body('ciudad').exists().notEmpty().isString().withMessage('La ciudad debe ser una cadena de caracteres'),
  body('actividad').exists().notEmpty().isString().withMessage('La actividad debe ser una cadena de caracteres'),
  body('resumen').exists().notEmpty().isString().withMessage('El resumen debe ser una cadena de caracteres'),


  (req,res,next) =>{
    return validateResults(req,res,next)
  }

]

const validatorUpdate =  [
  //* Validar el título asociado al comercio
  body('usuario').exists().withMessage('El usuario es necesario')
  .custom(async (value)=>{
    pagina = await paginasModelo.findOne({email_propietario: value.email})
    if(!pagina){
      throw new Error('El usuario'+value.email+' no tiene pagina asociada')
    }
  }),

  //*Validar el cuerpo de la petición
  body('titulo')
    .optional()
    .isString().withMessage('El título debe ser una cadena de caracteres')
    .custom(async (value) => {
      //*Comprobamos que sea único
      const pagina = await paginasModelo.findOne({ titulo: value });
      if (pagina) {
        throw new Error('El título ya existe');
      }
    }),
  body('ciudad')
    .optional()
    .isString().withMessage('La ciudad debe ser una cadena de caracteres'),
  body('actividad')
    .optional()
    .isString().withMessage('La actividad debe ser una cadena de caracteres'),
  body('resumen')
    .optional()
    .isString().withMessage('El resumen debe ser una cadena de caracteres'),
    (req,res,next) =>{
      return validateResults(req,res,next)
    }

];

const validatorDelete = [

   //* Validar el título asociado al comercio
   body('usuario').exists().withMessage('El usuario es necesario')
   .custom(async (value)=>{
     pagina = await paginasModelo.findOne({email_propietario: value.email})
     if(!pagina){
       throw new Error('El usuario '+value.email+' no tiene pagina asociada')
     }
   }),

  (req,res,next)=>{
    return validateResults(req,res,next)
  }
]

const validatorCrearFoto = [


 //* Validar que el comercio tiene una pagina.
  body('usuario').exists().withMessage('El usuario es requerido').bail()
  .custom(async (value)=>{

    const pagina = await paginasModelo.findOne({email_propietario: value.email})

    if (!pagina){
        throw new Error('El comercio '+value.email+" no tiene pagina asociada")
    }

  }),

  (req,res,next)=>{
    return validateResults(req,res,next)
  }


]

const validatorActualizarFoto = [
  
  //* Validar que el comercio tiene una pagina.
  body('usuario').exists().withMessage('El usuario es requerido').bail()
  .custom(async (value)=>{

    const pagina = await paginasModelo.findOne({email_propietario: value.email})

    if (!pagina){
        throw new Error('El comercio '+value.email+" no tiene pagina asociada")
    }

  }),
  
  //* Validar el id del parámetro de la ruta.
  param('id')
  .exists().withMessage('El titulo es requerido'),
  
  
  (req,res,next)=>{
    return validateResults(req,res,next)
  }
  
]

const validatorCrearTexto = [
  
  
 //* Validar que el comercio tiene una pagina.
 body('usuario').exists().withMessage('El usuario es requerido').bail()
 .custom(async (value)=>{

   const pagina = await paginasModelo.findOne({email_propietario: value.email})

   if (!pagina){
       throw new Error('El comercio '+value.email+" no tiene pagina asociada")
   }

 }),
  
  body('texto').exists().notEmpty().isString().withMessage('La foto debe ser una cadena de caracteres'),

  (req,res,next)=>{
    return validateResults(req,res,next)
  }

]

const validatorActualizarTexto = [

  //* Validar que el comercio tiene una pagina.
  body('usuario').exists().withMessage('El usuario es requerido').bail()
  .custom(async (value)=>{

    const pagina = await paginasModelo.findOne({email_propietario: value.email})

    if (!pagina){
        throw new Error('El comercio '+value.email+" no tiene pagina asociada")
    }

  }),

  //* Validar el id del parámetro de la ruta.
  param('id')
    .exists().withMessage('El id es requerido'),

  body('texto').exists().notEmpty().isString().withMessage('La foto debe ser una cadena de caracteres'),

  (req,res,next)=>{
    return validateResults(req,res,next)
  }

]

const validatorObtenerPaginas = [

  //* Validar el título del parámetro de la ruta.
  param('ciudad')
    .exists().withMessage('La ciudad es requerido').
    custom(async (value) => {
      //*Comprobamos que exista paginas de esa ciudad
      const pagina = await paginasModelo.findOne({ ciudad: value });
      if (!pagina) {
        throw new Error('No hay paginas de '+value);
      }
    }),

  (req,res,next)=>{
    return validateResults(req,res,next)
  }

]
const validatorObtenerPagina = [

  //* Validar el título del parámetro de la ruta.
  param('titulo')
    .exists().withMessage('El titulo es requerido').
    custom(async (value) => {
      //*Comprobamos que exista paginas de esa ciudad
      const pagina = await paginasModelo.findOne({ titulo: value });
      if (!pagina) {
        throw new Error('No existe la pagina '+value);
      }
    }),

  (req,res,next)=>{
    return validateResults(req,res,next)
  }

]

const validatorObtenerPaginasActividad = [

  //* Validar el título del parámetro de la ruta.
  param('ciudad')
    .exists().withMessage('La ciudad es requerido'),
  param('actividad')
    .exists().withMessage('La actividad es requerido'),
  

  (req,res,next)=>{
    return validateResults(req,res,next)
  }

]

const validatorActualizarReseña = [

  //* Validar el título del parámetro de la ruta.
  param('titulo')
    .exists().withMessage('El titulo es requerido').custom(async (value) => {
      //*Comprobamos que exista la pagina
      const pagina = await paginasModelo.findOne({ titulo: value });
      if (!pagina) {
        throw new Error('No existe esta web');
      }
    }),
  
  body('reseña.puntuacion').exists().isInt({min:1,max:5}).withMessage('La puntuación debe ser un número entre 1 y 5'),
  body('reseña.comentario').optional({ nullable: true }).isString().withMessage('El comentario debe ser una cadena de texto opcional'),
  
  check('usuario').exists().withMessage('El usuario es necesario.'),

  (req,res,next)=>{
    return validateResults(req,res,next)
  }

]




module.exports = {validatorCreate,
                  validatorUpdate,
                  validatorDelete,
                  validatorCrearFoto,
                  validatorActualizarFoto,
                  validatorCrearTexto,
                  validatorActualizarTexto,
                  validatorObtenerPaginas,
                  validatorObtenerPagina,
                  validatorObtenerPaginasActividad,
                  validatorActualizarReseña
                }
