const { matchedData } = require('express-validator')
const {paginasModelo} = require('../models')


const comprobarImagen = async (req,res,next) => {


    const {usuario} = matchedData(req)
    const {id} = matchedData(req)

    var titulo = await paginasModelo.findOne({email_propietario:usuario.email},{"_id":0,"titulo":1})

    //*Asignar titulo de la pagina del cliente
    titulo = titulo.titulo

    var fotos = await paginasModelo.findOne({titulo:titulo},{"_id":0,"fotos":1}) 
    fotos = fotos.fotos
    tamaño = fotos.length
    try{
        if (tamaño-1<id){
            throw new Error("No hay una imagen registrada en la posicion "+id)
        }
        return next()
    }catch(err){
        res.status(403)
        res.send("No hay una imagen registrada en la posicion "+id)
    }

}

module.exports = comprobarImagen