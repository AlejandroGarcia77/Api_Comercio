const {comerciosModelo, paginasModelo} = require('../models/')
const handleHttpError = require('../utils/handleError')
const { matchedData } = require('express-validator')
const { tokenSign } = require('../utils/handleJWT')

const mostrarComercios = async (req, res) =>{
    
    try{
        data = await comerciosModelo.find({},{"_id":0,"telefonos._id":0,"deleted":0,"__v":0})//*Solo mostramos los valores que nos interesan
        res.send(data)
    }catch(err){
        handleHttpError(res,'ERROR_OBTENER_COMERCIOS')
    }
}


const mostrarComercio = async (req, res) =>{

    const {CIF} = matchedData(req)

    try{
        data = await comerciosModelo.findOne({CIF:CIF},{"_id":0,"telefonos._id":0,"deleted":0,"__v":0})//*Solo mostramos los valores que nos interesan
        res.send(data)
    }catch(err){
        handleHttpError(res,'ERROR_OBTENER_COMERCIOS')
    }

}

const crearComercio = async (req, res) => {
    try {

        const body = matchedData(req)

        body.rol = "comercio"//*Asignamos su rol

        const data = await comerciosModelo.create(body);

        const token = tokenSign(data)
        res.status(200).send("Token creado: "+token)
            
    }catch(err){
        handleHttpError(res,'ERROR_CREAR_COMERCIOS')
    }
}

const actualizarComercio = async (req, res) => {
    try {
        const {CIF} = matchedData(req)
        const body = matchedData(req)
        
        //*Actualizamos el email del propietario en la pagina tambien para mantener su relacion
        if(body.email){
            var email_antiguo = await comerciosModelo.findOne({CIF:CIF},{"_id":0,"email":1});
            email_antiguo = email_antiguo.email
            await paginasModelo.updateOne({email_propietario:email_antiguo},{email_propietario:body.email});
        }


        await comerciosModelo.updateOne({CIF:CIF},body);
        res.status(200).send("Comercio con CIF:"+CIF+" ha sido actualizado correctamente.")    
    }catch(err){
        handleHttpError(res, 'ERROR_ACTUALIZAR_COMERCIOS')
    }
}


const eliminarComercio = async (req, res) => {

    try{
        const {CIF} = matchedData(req)
        
        //*Sacamos el correo del propietario para eliminar su pagina
        var email = await comerciosModelo.findOne({CIF:CIF},{"_id":0,"email":1})

        email = email.email

        await comerciosModelo.deleteOne({CIF:CIF})
        
        //*Eliminamos la página asociada al comercio
        await paginasModelo.deleteOne({email_propietario:email})

        res.status(200).send("El comercio con el CIF:"+CIF+" ha sido eliminado correctamente y su pagina.")
    }catch(err){
        handleHttpError(res, 'ERROR_ELIMINAR_COMERCIOS')
    }

}

module.exports = {
    mostrarComercio,
    mostrarComercios,
    crearComercio,
    actualizarComercio,
    eliminarComercio
}