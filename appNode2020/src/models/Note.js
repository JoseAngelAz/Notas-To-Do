const mongoose = require('mongoose');//para el esquema de datos
const {Schema}=mongoose;

//aqui le decimos a node como van a lucir mis datos
//pero no sabe crear el modelo
const NoteSchema = new Schema({
    title:{ type: String, required:true},
    description: {type: String, required:true},
    date:{type: Date, default:Date.now},//creamos la propiedad user
    //cada nota debería estar enlazada a cada user.
    /*pero crearemos un String y este almacenará ese ID del user
      en el momento que se cree una nota nueva. en notes.js metodo new note
     */
    user:{type:String}
});

//para usar este modelo de datos en otra parte de mi app
module.exports = mongoose.model('Note',NoteSchema);
