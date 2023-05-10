const { body,param } = require('express-validator');
const validateResults = require('../utils/handleValidator');
const {comerciosModelo} = require('../models');
const validator = require('validator');
const validarCIF = require('../utils/handleCIF');

const validatorCreate = [

          body('usuario').exists().withMessage('El usuario es necesario').bail(),
          body('CIF')
            .exists()
            .isLength({ min: 9, max: 9 })
            .withMessage('El CIF debe tener una longitud de 9 caracteres').bail()
            .isString()
            .withMessage('El CIF debe ser un texto')
            .custom((value) => {
              //*Comprobamos que es un CIF real
              if (!validarCIF(value)) {
                throw new Error('El CIF no es válido');
              }
              return true
            }).bail()
            .custom(async (value) => {
              //*Comprobamos si existe el CIF de la empresa
              const comercio = await comerciosModelo.findOne({ CIF: value });
              if (comercio) {
                throw new Error("Ya existe un comercio con este CIF")
              }
            }),
          body('nombre').exists().isString().withMessage('El nombre debe ser un texto'),
          body('direccion')
            .exists()
            .isString()
            .withMessage('La dirección debe ser un texto'),
          body('email')
            .exists()
            .isEmail()
            .withMessage('El email debe ser válido')
            .custom(async (value) => {
              //*Comprobamos si existe el email
              const comercio = await comerciosModelo.findOne({ email: value });
              if (comercio) {
                throw new Error("Ya existe un comercio con este email")
              }
            }),
          body('resumen').exists().isString().withMessage('El resumen debe ser un texto'),
          body('telefonos').isArray(),
          body('telefonos.*')
            .custom((value) => {
              //*Comprobamos que sea un telefono español
              if (!validator.isMobilePhone(value, 'es-ES')) {
                throw new Error('El teléfono no es válido');
              }
              return true
            }),
  
    (req,res,next) =>{
      return validateResults(req,res,next)
    }
]


const validatorUpdate = [

  param('CIF').exists()
  .withMessage('El titulo es requerido')
  .isLength({ min: 9, max: 9 })
  .withMessage('El CIF debe tener una longitud de 9 caracteres').bail()
  .isString()
  .withMessage('El CIF debe ser un texto')
  .custom((value) => {
    //*Comprobamos que es un CIF real
    if (!validarCIF(value)) {
      throw new Error('El CIF no es válido');
    }
    return true
  }).bail()
  .custom(async (value) => {
    //*Comprobamos si existe un comercio con este CIF
    const comercio = await comerciosModelo.findOne({ CIF: value });
    if (!comercio) {
      throw new Error("No hay un comercio registrado con el CIF:"+value)
    }
  }),

  body('nombre').optional().isString().withMessage('El nombre debe ser un texto'),
  body('direccion')
    .optional()
    .isString()
    .withMessage('La dirección debe ser un texto'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('El email debe ser válido')
    .custom(async (value) => {
      //*Comprobamos si existe el email
      const comercio = await comerciosModelo.findOne({ email: value });
      if (comercio) {
        throw new Error("Ya existe un comercio con este email")
      }
    }),
  body('telefonos').optional().isArray(),
  body('telefonos.*').optional()
    .custom((value) => {
      //*Comprobamos que sea un telefono español
      if (!validator.isMobilePhone(value, 'es-ES')) {
        throw new Error('El teléfono no es válido');
      }
      return true
    }),

  (req,res,next) =>{
    return validateResults(req,res,next)
  }
]

const validatorGet = [

  param('CIF').exists()
  .withMessage('El titulo es requerido')
  .isLength({ min: 9, max: 9 })
  .withMessage('El CIF debe tener una longitud de 9 caracteres').bail()
  .isString()
  .withMessage('El CIF debe ser un texto')
  .custom((value) => {
    //*Comprobamos que es un CIF real
    if (!validarCIF(value)) {
      throw new Error('El CIF no es válido');
    }
    return true
  }).bail()
  .custom(async (value) => {
    //*Comprobamos si existe un comercio con este CIF
    const comercio = await comerciosModelo.findOne({ CIF: value });
    if (!comercio) {
      throw new Error("No hay un comercio registrado con el CIF:"+value)
    }
  }),

  (req,res,next) =>{
    return validateResults(req,res,next)
  }

]


const validatorDelete = [

  param('CIF').exists()
  .withMessage('El titulo es requerido')
  .isLength({ min: 9, max: 9 })
  .withMessage('El CIF debe tener una longitud de 9 caracteres').bail()
  .isString()
  .withMessage('El CIF debe ser un texto')
  .custom((value) => {
    //*Comprobamos que es un CIF real
    if (!validarCIF(value)) {
      throw new Error('El CIF no es válido');
    }
    return true
  }).bail()
  .custom(async (value) => {
    //*Comprobamos si existe un comercio con este CIF
    const comercio = await comerciosModelo.findOne({ CIF: value });
    if (!comercio) {
      throw new Error("No hay un comercio registrado con el CIF:"+value)
    }
  }),

  (req,res,next) =>{
    return validateResults(req,res,next)
  }

]


module.exports = {
    validatorGet,
    validatorCreate,
    validatorUpdate,
    validatorDelete
}
