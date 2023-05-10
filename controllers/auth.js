const { matchedData } = require("express-validator")
const { tokenSign } = require("../utils/handleJWT")
const { compare } = require("../utils/handlePassword")
const handleHttpError = require("../utils/handleError")
const {usuariosModelo} = require("../models")

const loginCtrl = async (req, res) => {
    try {

        const {email} = matchedData(req)
        const {contrasenia} = matchedData(req)
       
        usuario = await usuariosModelo.findOne({email: email},{"_id":0,"email":1,"contrasenia":1,"rol":1})

        if(!usuario){
            handleHttpError(res, "USER_NOT_EXISTS", 404)
        }
        
        const contraseniaEncriptada = usuario.contrasenia;
        const check = await compare(contrasenia, contraseniaEncriptada)

        if(!check){
            handleHttpError(res, "INVALID_PASSWORD", 401)
            return
        }


        
        usuario.set('contrasenia', undefined, {strict: false})
        token = await tokenSign(usuario)
       
        //*Modificamos el ultimo inicio de sesion a ahora 

        await usuariosModelo.findOneAndUpdate({email: email},{fecha_login: Date.now()})
       
        res.send(email+" iniciado con exito: "+token)

    }catch(err){
        console.log(err)
        handleHttpError(res, "ERROR_LOGIN_USER")
    }
}

module.exports ={
    loginCtrl,
}