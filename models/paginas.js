const mongoose = require("mongoose")
const mongooseDelete = require("mongoose-delete")

const PaginasSchema = new mongoose.Schema(
    {
        email_propietario:{
            type: String,
            unique: true,
            index: true
        },
        titulo:{
            type: String,
            unique: true
        },
        ciudad:{
            type: String
        },
        actividad:{
            type: String
        },
        resumen:{
            type: String
        },
        textos:{
            type: [String]
        },
        fotos:{
            type: [{
                filename: String,
                url: String
            }]
        },
        rating:{
            type: Number,
            default:0,
            index:true
        },
        reseñas:[{
            usuario:{
                type: String
            },
            puntuacion:{
                type: Number
            },
            comentario:{
                type: String,
                default: null
            }        
        } ]   
    }
)

PaginasSchema.plugin(mongooseDelete,{overrideMethods: true})
module.exports = mongoose.model("paginas", PaginasSchema)