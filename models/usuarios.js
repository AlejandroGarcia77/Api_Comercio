const mongoose = require("mongoose")
const mongooseDelete = require("mongoose-delete")
const bcrypt = require('bcrypt');

const UsuariosSchema = new mongoose.Schema(
    {
        
        email:{
            type: String,
            index:true,
            unique: true
        },
        nombre:{
            type: String
        },
        contrasenia:{
            type: String
        },
        edad:{
            type: Number
        },
        ciudad:{
            type: String
        },
        intereses:{
            type: [String]
        },
        rol:{
            type: String,
            enum: ["admin","usuario_registrado","comercio"]
        },
        //*Añadimos la fecha de creacion y de inicio de sesión del usuario
        fecha_creacion:{
            type: Date,
            default: Date.now()
        },
        fecha_login:{
            type: Date,
            default: Date.now(),
            index: true
        },
        permiteRecibirOfertas:{
            type: Boolean,
            default: false
        }
    }
)

UsuariosSchema.pre('save', async function (next) {
    const usuario = this;
    if (!usuario.isModified('contrasenia')) return next();
  
    try {
      const hash = await bcrypt.hash(usuario.contrasenia,process.env.SALT);
      usuario.contrasenia = hash;
      next();
    } catch (err) {
      return next(err);
    }
  });


UsuariosSchema.plugin(mongooseDelete,{overrideMethods: true})
module.exports = mongoose.model("usuarios", UsuariosSchema)