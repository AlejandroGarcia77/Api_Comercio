const { body,param } = require('express-validator');
const validateResults = require('../utils/handleValidator');
const {usuariosModelo} = require('../models/index');


const validatorLogin = [

    body('email')
    .optional()
    .isEmail()
    .withMessage('El email debe ser válido')
    .custom(async (value) => {
      //*Comprobamos si existe el email
      const usuario = await usuariosModelo.findOne({ email: value });
      if (!usuario) {
        throw new Error("No existe el usuario con el email "+value);
      }
    }),

    body('contrasenia').exists().notEmpty().withMessage("La contraseña es necesaria"),

    (req,res,next) =>{
        return validateResults(req,res,next)
    }

]


module.exports = {
    validatorLogin
}