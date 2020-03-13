const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    date:{type:Date, default:Date.now}

});

//metodos para los usuarios que luego tendremos que llamar
//cramos un metodo para encriptar la contraseña que reciba como
//parámetro un password que se encriptará con bcryptjs.
UserSchema.methods.encryptPassword = async (password)=>{
  const salt = await bcrypt.genSalt(10);
  const hash = bcrypt.hash(password, salt);
  return hash;
};

//metodo que tomará la contraseña y comparara con lo que se tiene
//en la base de datos.
//
UserSchema.methods.matchPassword = async function (password){
    return await bcrypt.compare(password, this.password);//contraseña que se le está dando y la que se tiene en modelo de datod
};


module.exports = mongoose.model('User', UserSchema);