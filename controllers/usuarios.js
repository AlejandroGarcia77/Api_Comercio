const {usuariosModelo, paginasModelo} = require('../models/')
const handleHttpError = require('../utils/handleError')
const { matchedData } = require('express-validator')
const { encrypt } = require('../utils/handlePassword')
const {tokenSign} = require('../utils/handleJWT');


const mostrarUsuarios = async (req,res) => { 

    try {
        const {usuario} = matchedData(req);

        var ciudad = await paginasModelo.findOne({email_propietario:usuario.email},{"_id":0,"ciudad":1})
        ciudad = ciudad.ciudad
        var data
        if(req.query.orden==1 || req.query.orden==-1){
             data = await usuariosModelo.find({ciudad:ciudad,permiteRecibirOfertas:true},{"_id":0,"deleted":0,"__v":0}).sort({fecha_login:req.query.orden})
        }else{
             data = await usuariosModelo.find({ciudad:ciudad,permiteRecibirOfertas:true},{"_id":0,"deleted":0,"__v":0})
        }
        res.send(data)
    } catch (err) {
        console.error({err})
        handleHttpError(res,'ERROR_OBTENER_USUARIOS')
    }

}

const crearUsuarios = async (req, res) => {
    try {
        const body = matchedData(req)

        //*Usamos como email de administrador ##Testing##
        if(body.email=="admin@gmail.com"){
            body.rol = "admin"//* asignamos su rol
        }else{
            body.rol = "usuario_registrado"//* asignamos su rol 
        }
        const data = await usuariosModelo.create(body);//*Se hashea la contraseña desde el propio modelo
        token = await tokenSign(data)
        res.send("Token creado:"+token)    
    }catch(err){
        handleHttpError(res,'ERROR_CREAR_USUARIOS')
    }
}

const actualizarUsuarios = async (req, res) => {
    try {
        const {usuario} = matchedData(req)
        const body = matchedData(req)

        const email = usuario.email

        if(body.contrasenia){
            hash = await encrypt(body.contrasenia)
            body.contrasenia = hash;
        }
        await usuariosModelo.updateOne({email:email},body);
        res.status(200).send("Usuario con el email: "+email+" ha sido actualizado correctamente.")    
    }catch(err){
        handleHttpError(res, 'ERROR_ACTUALIZAR_USUARIO')
    }
}

const eliminarUsuarios = async (req, res) => {

    try {
        const {usuario} = matchedData(req)
        const email = usuario.email

        await usuariosModelo.deleteOne({email:email})

        res.status(200).send("Usuario con email: "+email+" ha sido eliminado correctamente")

    } catch (err) {
        handleHttpError(res, 'ERROR_ELIMINAR_USUARIO')
    }

}


module.exports = {
    mostrarUsuarios,
    crearUsuarios,
    actualizarUsuarios,
    eliminarUsuarios
}