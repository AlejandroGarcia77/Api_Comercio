const { matchedData } = require('express-validator')
const {paginasModelo} = require('../models')


const comprobarActividad = async (req,res,next) => {


    const {ciudad} = matchedData(req)
    const {actividad} = matchedData(req)

    let paginas = await paginasModelo.findOne({ciudad:ciudad,actividad:actividad},{"_id":0,"textos":1}) 
    
    try{
        if (!paginas){
            throw new Error("No se puede modificar ese registro")
        }
        return next()
    }catch(err){
        res.status(403) // Por ahora lo dejamos como no permitido
        res.send("No existe paginas en "+ciudad+" de "+actividad)
    }

}

module.exports = comprobarActividad