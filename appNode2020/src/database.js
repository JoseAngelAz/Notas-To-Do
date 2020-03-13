/*Conexion a la base de datos, aquí ocuparemos el modulo de
mongoose para conectarnos a la base de datos que en este proyecto
será MONGO DB
*/

const mongoose= require('mongoose');
//hacemos la conecciona local host y le damos un nombre
//a la db y le colocamos un objeto para configurarlo,
//ponemos un par de propiedades
mongoose.connect('mongodb://localhost/note-db-app',{
useCreateIndex: true,
useNewUrlParser:true,
useFindAndModify:false,
useUnifiedTopology:true//linea agregada para quitar el waring 
/*Esto es para usar Mongoose de una manera sencilla para poder
crear nuestros datos, eliminarlos y demás  sin que nos de ningun
error, para funcionamiento de la biblioteca.*/
})

/*Una vez se conecte quiero un mensaje por consola así que vamos
a ejecutar una promesa.
*/
 .then(db => console.log('DB is connected'))
.catch(err => console.error(err));

/*EN EL INDEX VAS A INICIALIZAR LA BASE DE DATOS */