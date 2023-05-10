const mongoose = require("mongoose")
const mongooseDelete = require("mongoose-delete")

const ComerciosSchema = new mongoose.Schema(
    {
        CIF:{
            type: String,
            index:true,
            unique: true
        },
        nombre:{
            type: String
        },
        direccion:{
            type: String
        },
        email:{
            type: String,
            unique: true,
            index: true
        },
        telefonos:{
           type: [String] 
        },
        resumen:{
           type: String
        },
        rol:{
            type: String,
            enum: ["admin","comercio","usuario_registrado"]
        }
    
    }
)

ComerciosSchema.plugin(mongooseDelete,{overrideMethods: true})
module.exports = mongoose.model("comercios", ComerciosSchema)