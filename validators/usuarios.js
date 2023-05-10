const { body,param } = require('express-validator');
const validateResults = require('../utils/handleValidator');
const {usuariosModelo, paginasModelo} = require('../models');


const validatorGet = [

  body('usuario')
  .exists().withMessage('El usuario es necesario')
  .custom(async (value) =>{
    //*Comprobamos si existe un usuario en esa ciudad
    var ciudad = await paginasModelo.findOne({email_propietario: value.email},{"_id":0,"ciudad":1});
    if(ciudad){
      var ciudad = ciudad.ciudad
      const usuario = await usuariosModelo.findOne({ ciudad: ciudad,permiteRecibirOfertas:true});
      if (!usuario) {
        throw new Error("No hay usuarios en "+ciudad+" que permitan recibir ofertas.")
      }
    }else{
      throw new Error("El propietario "+value.email+" no tiene pagina asociada.")
    }
    
  }).bail(),

  (req,res,next) =>{
    return validateResults(req,res,next)
  }  

]


const validatorCreate = [
      body('email')
        .exists()
        .isEmail()
        .withMessage('El email debe ser válido')
        .custom(async (value) => {
            //*Comprobamos si existe el email
            const usuario = await usuariosModelo.findOne({ email: value });
            if (usuario) {
              throw new Error("Ya existe un usuario con este email")
            }
        }).bail(),
      body('nombre').exists().isString().withMessage('El nombre debe ser una cadena de caracteres'),
      body('contrasenia').exists()
      .isStrongPassword()
      .withMessage('Longitud: La contraseña debe tener al menos 8 caracteres.\nLetras mayúsculas: La contraseña debe contener al menos una letra mayúscula.\nLetras minúsculas: La contraseña debe contener al menos una letra minúscula.\nNúmeros: La contraseña debe contener al menos un número.\nCaracteres especiales: La contraseña debe contener al menos un carácter especial (por ejemplo, !, @, #, $, %, ^, &, *, (, ), _, +, -, =, {, }, [, ], |, , :, ;, ",<, >, ,, ., ?, /).'),
      body('edad').exists().toInt().isInt({ min: 1, max: 99 }).withMessage('La edad debe ser un número del 1 al 99'),
      body('ciudad').exists().isString().withMessage('El nombre debe ser una cadena de caracteres'),
      body('intereses').isArray()
      .custom((value) => {
        for (let i = 0; i < value.length; i++) {
          if (typeof value[i] !== 'string') {
            throw new Error('Los intereses deben ser cadenas de texto');
          }
        }
        return true;
      }),
      body('permiteRecibirOfertas').optional().isBoolean(),

      (req,res,next) =>{
        return validateResults(req,res,next)
      }      
    ];


    const validatorUpdate = [

      body('usuario').exists().withMessage("El usuario es necesario.").bail()
      .custom(async (value) => {

        if(value.email){
            const usuario = await usuariosModelo.findOne({ email: value.email });
            if (!usuario) {
              throw new Error("No hay un usuario registrado con el email ",value.email);
            }
        }else{
          throw new Error("El email del usuario es necesario")
        }

      }).bail(),
      
      body('email')
        .optional()
        .isEmail()
        .withMessage('El email debe ser válido')
        .custom(async (value) => {
            //*Comprobamos si existe el email
            const usuario = await usuariosModelo.findOne({ email: value });
            if (usuario) {
            throw new Error("Ya existe un usuario con este email")
            }
        }),
      body('nombre').optional().isString().withMessage('El nombre debe ser una cadena de caracteres'),
      body('contrasenia').optional()
      .isStrongPassword()
      .withMessage('Longitud: La contraseña debe tener al menos 8 caracteres.\nLetras mayúsculas: La contraseña debe contener al menos una letra mayúscula.\nLetras minúsculas: La contraseña debe contener al menos una letra minúscula.\nNúmeros: La contraseña debe contener al menos un número.\nCaracteres especiales: La contraseña debe contener al menos un carácter especial (por ejemplo, !, @, #, $, %, ^, &, *, (, ), _, +, -, =, {, }, [, ], |, , :, ;, ",<, >, ,, ., ?, /).'),
      body('edad').optional().toInt().isInt({ min: 1, max: 99 }).withMessage('La edad debe ser un número del 1 al 99'),
      body('ciudad').optional().isString().withMessage('El nombre debe ser una cadena de caracteres'),
      body('intereses').optional().isArray()
      .custom((value) => {
        for (let i = 0; i < value.length; i++) {
          if (typeof value[i] !== 'string') {
            throw new Error('Los intereses deben ser cadenas de texto');
          }
        }
        return true;
      }),
      body('permiteRecibirOfertas').optional().isBoolean().withMessage('Debe ser un valor true o false'),

      (req,res,next) =>{
        return validateResults(req,res,next)
      }      
    ];

    const validatorDelete = [

      body('usuario').exists().withMessage('El usuario es necesario').bail()
      .custom(async (value) => {

        if(value.email){
            const usuario = await usuariosModelo.findOne({ email: value.email });
            if (!usuario) {
              throw new Error("No hay un usuario registrado con el email ",value.email);
            }
        }else{
          throw new Error("El email del usuario es necesario")
        }

      }).bail(),
      
      (req,res,next) =>{
        return validateResults(req,res,next)
      }  
    ]

  module.exports = {
    validatorGet,
    validatorCreate,
    validatorUpdate,
    validatorDelete,
  }