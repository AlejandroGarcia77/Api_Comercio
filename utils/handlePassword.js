const bcrypt = require('bcrypt');

const encrypt = async (clearPassword) =>{
    const hash = await bcrypt.hash(clearPassword,process.env.SALT);
    return hash
}

const compare = async (clearPassword, hashedPassword) =>{
    const result = await bcrypt.compare(clearPassword,hashedPassword)
    return result
}

module.exports = {encrypt,compare}