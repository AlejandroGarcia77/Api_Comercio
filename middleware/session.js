
const { usuariosModelo, comerciosModelo } = require("../models")
const handleHttpError = require("../utils/handleError")
const { verifyToken } = require("../utils/handleJWT")

const authMiddleware = async (req, res, next) => {
    try{
        if (!req.headers.authorization) {
            handleHttpError(res,"NOT_TOKEN", 401)
            return
        }

        //* Nos llega la palabra reservada Bearer (es un estándar) y el Token, así que me quedo con la última parte
        const token = req.headers.authorization.split(' ').pop() 
        //*Del token, miramos en Payload (revisar verifyToken de utils/handleJwt)
        const dataToken = await verifyToken(token)
        if(!dataToken) {
            handleHttpError(res,"ERROR_ID_TOKEN", 401)
            return
        }

        if(dataToken.rol == "comercio"){
            const usuario = await comerciosModelo.findOne({email: dataToken.email})
            req.body.usuario = usuario //* Inyecto al usuario en la petición

        }else if(dataToken.rol == "usuario_registrado" || dataToken.rol == "admin"){
            const usuario = await usuariosModelo.findOne({email: dataToken.email})
            req.body.usuario = usuario //* Inyecto al usuario en la petición
        }
    
        next()

    }catch(err){
        handleHttpError(res,"NOT_SESSION", 402)
    }
}

module.exports = {authMiddleware}