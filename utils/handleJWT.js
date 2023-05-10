const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET

const tokenSign = (user)=>{
    const signature =jwt.sign(
        {
            email:user.email,
            rol:user.rol
        },
        JWT_SECRET,
        {
            expiresIn:"365d"//*Tiempo por seguridad para en el que debe volver a iniciar sesion
        }
    )
    return signature
}

const verifyToken = async(tokenJwt) =>{
    try{
        return jwt.verify(tokenJwt,JWT_SECRET)
    }catch(e){
        console.log(e)
    }
}

module.exports ={tokenSign, verifyToken}