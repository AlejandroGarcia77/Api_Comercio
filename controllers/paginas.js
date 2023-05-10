const {paginasModelo} = require('../models/')
const handleHttpError = require('../utils/handleError')
const { matchedData } = require('express-validator')

const mostrarPaginas = async (req, res) => {
    try{

        //*Comprobamos si quieren que ordenemos las paginas
        if (req.query.orden==1 || req.query.orden==-1){
            data = await paginasModelo.find({},{"_id":0,"reseñas._id":0,"deleted":0,"__v":0}).sort({rating:req.query.orden})//*Solo mostramos los valores que nos interesan
        }else{
            data = await paginasModelo.find({},{"_id":0,"reseñas._id":0,"deleted":0,"__v":0})//*Solo mostramos los valores que nos interesan
        }
        res.send(data)
    }catch(err){
        handleHttpError(res,'ERROR_OBTENER_PAGINAS')
    }
}

const mostrarPagina = async (req, res) => {
    
    const {titulo} = matchedData(req)
    
    try{
        data = await paginasModelo.findOne({titulo:titulo},{"_id":0,"reseñas._id":0,"deleted":0,"__v":0})//*Solo mostramos los valores que nos interesan
        res.send(data)
    }catch(err){
        handleHttpError(res,'ERROR_OBTENER_PAGINAS')
    }
}


const crearPagina = async (req, res) => {
    try {
        const body = matchedData(req)
        const {usuario} = matchedData(req)
        const email = usuario.email

        //*Asignamos el email del comercio
        body.email_propietario = email

        const data = await paginasModelo.create(body);
        res.send("La pagina "+data.titulo+" ha sido creada con exito y asignada a "+email)    
    }catch(err){
        handleHttpError(res,'ERROR_CREAR_PAGINA')
    }
}

const actualizarPagina = async (req, res) => {
    try {
        const body = matchedData(req)
        const {usuario} = matchedData(req)

        var titulo = await paginasModelo.findOne({email_propietario:usuario.email},{"_id":0,"titulo":1})

        //*Asignamos el titulo de la pagina de la empresa
        titulo = titulo.titulo
        await paginasModelo.updateOne({titulo:titulo},body);

        //*Cambiamos el titulo si ha sido actualizado
        if(body.titulo){
            res.status(200).send("Página "+body.titulo+" ha sido actualizada correctamente.")    
        }else{
            res.status(200).send("Página "+titulo+" ha sido actualizada correctamente.")    
        }
        
    }catch(err){
        handleHttpError(res, 'ERROR_ACTUALIZAR_PAGINA')
    }
}

const eliminarPagina = async (req, res) => {

    try{
        const {usuario} = matchedData(req);

        var titulo = await paginasModelo.findOne({email_propietario:usuario.email},{"_id":0,"titulo":1})

        //*Asignar titulo de la pagina del cliente
        titulo = titulo.titulo

        await paginasModelo.deleteOne({titulo:titulo})
        res.status(200).send("Página "+titulo+" eliminada correctamente.")
    }catch(err){
        handleHttpError(res, 'ERROR_ELIMINAR_PAGINA')
    }

}

const añadirFoto = async (req, res) => {

    const {usuario} = matchedData(req)
    const {file} = req

    try{
        const fileData = {
            filename: file.filename,
            url: process.env.PUBLIC_URL +"/"+file.filename
        }

        var titulo = await paginasModelo.findOne({email_propietario:usuario.email},{"_id":0,"titulo":1})

        //*Asignar titulo de la pagina del cliente
        titulo = titulo.titulo

        //*Cogemos las fotos para añadir la nueva
        let fotos = await paginasModelo.findOne({titulo:titulo},{"_id":0,"fotos":1}) 
        fotos = fotos.fotos
        fotos.push(fileData)

        //*Actualizamos el array fotos con la nueva 
        await paginasModelo.updateOne({titulo:titulo},{fotos:fotos});

        res.status(200).send("Página "+titulo+" se ha añadido la foto:"+fileData.filename+" correctamente.")
    }catch(err) {
        handleHttpError(res,"ERROR_AÑADIR_FOTO")
    }

}

const actualizarFoto = async (req, res) => {
    
    
    try{
        const {id} = matchedData(req)
        const {usuario} = matchedData(req)
        const {file} = req

        const fileData = {
            filename: file.filename,
            url: process.env.PUBLIC_URL +"/"+file.filename
        }

        var titulo = await paginasModelo.findOne({email_propietario:usuario.email},{"_id":0,"titulo":1})

        //*Asignar titulo de la pagina del cliente
        titulo = titulo.titulo


        //*Cogemos las fotos para añadir la nueva
        let fotos = await paginasModelo.findOne({titulo:titulo},{"_id":0,"fotos":1}) 
        fotos = fotos.fotos
        fotos[id] = fileData
        
        //*Actualizamos el array fotos con la nueva 
        await paginasModelo.updateOne({titulo:titulo},{fotos:fotos});
        
        res.status(200).send("Página "+titulo+" ha añadido la foto:"+fileData.filename+" en la posición "+id+" correctamente.")
        
    }catch(err){
        handleHttpError(res,"ERROR_ACTUALIZAR_FOTO");
    }
    
    
}

const añadirTexto = async (req, res) => {
    
    
    const {texto} = matchedData(req)
    const {usuario} = matchedData(req)
        
    try{
        var titulo = await paginasModelo.findOne({email_propietario:usuario.email},{"_id":0,"titulo":1})

        //*Asignar titulo de la pagina del cliente
        titulo = titulo.titulo


        //*Cogemos los textos para añadir el nuevo
        let textos = await paginasModelo.findOne({titulo:titulo},{"_id":0,"textos":1}) 
        textos = textos.textos
        textos.push(texto)
        
        //*Actualizamos el array texto con el nuevo 
        await paginasModelo.updateOne({titulo:titulo},{textos:textos});
        
        res.status(200).send("Página "+titulo+" se ha añadido el texto:"+texto+" correctamente.")
    }catch(err){
        handleHttpError(res,"ERROR_AÑADIR_TEXTO")
    }
}

const actualizarTexto = async (req, res) => {
    
    
    try{
        
        const {id} = matchedData(req)
        const {texto} = matchedData(req)
        const {usuario} = matchedData(req)
        

        var titulo = await paginasModelo.findOne({email_propietario:usuario.email},{"_id":0,"titulo":1})

        //*Asignar titulo de la pagina del cliente
        titulo = titulo.titulo


        //*Cogemos las fotos para añadir la nueva
        let textos = await paginasModelo.findOne({titulo:titulo},{"_id":0,"textos":1}) 
        textos = textos.textos
        textos[id] = texto
        
        //*Actualizamos el array fotos con la nueva 
        await paginasModelo.updateOne({titulo:titulo},{textos:textos});
        
        res.status(200).send("Página "+titulo+" ha añadido el texto:"+texto+" en la posición "+id+" correctamente.")
        
    }catch(err){
        handleHttpError(res,"ERROR_ACTUALIZAR_TEXTO");
    }
    
    
}

const buscarPaginas = async(req,res) => {


    const {ciudad} = matchedData(req)

    try{
        data = await paginasModelo.find({ciudad:ciudad},{"_id":0,"reseñas._id":0,"deleted":0,"__v":0})//*Solo mostramos los valores que nos interesan
        res.send(data)
    }catch(err){
        handleHttpError(res,'ERROR_OBTENER_PAGINAS')
    }

}

const buscarPaginasActividad = async(req,res) => {
    
    const {ciudad} = matchedData(req)
    const {actividad} = matchedData(req)

    try{
        data = await paginasModelo.find({ciudad:ciudad,actividad:actividad},{"_id":0,"reseñas._id":0,"deleted":0,"__v":0})//*Solo mostramos los valores que nos interesan
        res.send(data)
    }catch(err){
        handleHttpError(res,'ERROR_OBTENER_PAGINAS')
    }

}

const actualizarReseña = async(req,res) => {

    const {titulo} = matchedData(req)
    const {usuario} = matchedData(req)
    const {reseña} = matchedData(req)

    try{
        array = await paginasModelo.find({titulo:titulo},{"_id":0,"reseñas":1})
        
        //*Añadimos el correo para identificar al usuario de la reseña
        nuevaReseña = {usuario:usuario.email,...reseña}

        const reseñas = array[0].reseñas

        let indice = reseñas.findIndex(element => element.usuario === usuario.email)

        if (indice != -1){
            reseñas[indice] = nuevaReseña
        }else{
            reseñas.push(nuevaReseña)
        }

        var suma = 0
        var numero_reseñas = 0
        reseñas.forEach(element => {
            suma += element.puntuacion
            numero_reseñas++           
        });

        //*Calculamos el rating con la nueva reseña
        var rating = suma/numero_reseñas

        await paginasModelo.findOneAndUpdate({titulo:titulo},{reseñas:array[0].reseñas,rating:rating})

        res.send("El usuario "+usuario.email+" ha publicado su reseña en "+titulo+" con exito")
    }catch(err){
        handleHttpError(res,'ERROR_OBTENER_PAGINAS')
    }

}

module.exports = {
    mostrarPaginas,
    mostrarPagina,
    crearPagina,
    actualizarPagina,
    eliminarPagina,
    añadirFoto,
    actualizarFoto,
    añadirTexto,
    actualizarTexto,
    buscarPaginas,
    buscarPaginasActividad,
    actualizarReseña
}