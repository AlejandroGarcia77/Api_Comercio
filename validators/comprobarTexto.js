const { matchedData } = require('express-validator')
const {paginasModelo} = require('../models')


const comprobarTexto = async (req,res,next) => {


    const {usuario} = matchedData(req)
    const {id} = matchedData(req)


    var titulo = await paginasModelo.findOne({email_propietario:usuario.email},{"_id":0,"titulo":1})
    
    //*Asignar titulo de la pagina del cliente
    titulo = titulo.titulo

    let textos = await paginasModelo.findOne({titulo:titulo},{"_id":0,"textos":1}) 
    textos = textos.textos
    tamaño = textos.length
    try{
        if (tamaño-1<id){
            throw new Error("No hay un texto registrado en la posicion "+id)
        }
        return next()
    }catch(err){
        res.status(403) // Por ahora lo dejamos como no permitido
        res.send("No hay un texto registrado en la posicion "+id)
    }

}

module.exports = comprobarTexto