const handleHttpError = require('../utils/handleError')

const checkRol = (roles) => (req,res,next)=>{
    try{
        const {usuario} = req.body
        const usuarioRol = usuario.rol

        const checkValueRol = roles.includes(usuarioRol)

        if(!checkValueRol){
            handleHttpError(res,"NOT_ALLOWED",403)
            return
        }
        next()
    }catch(err){
        handleHttpError(res,"ERROR_PERMISSION",405)
    }
}

module.exports = checkRol