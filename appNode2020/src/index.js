const express = require('express');
const path = require('path');//para encontrar y unir rutas
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');//para usarlo en middleware
const Handlebars = require('handlebars');
const{allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
//INICIALIZACIONES
const app = express();
//base de datos
require('./database');
require('./config/passport');

//SETTINGS
app.set('port',process.env.PORT|| 3000)
//Unimos el path de src a la de views
app.set('views', path.join(__dirname, 'views'));
app.set('angel',path.join(__dirname,'angel'));//intento que index tenga acceso a angel
app.engine('.hbs',exphbs({
    defaultLayout: 'main',//la plantilla principal  de la app    
    layoutDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'), 'partials') ,//pequeñas partes de html que podemos reutilizar en cualquier vista
    extname: '.hbs',
    handlebars:allowInsecurePrototypeAccess(Handlebars)
}));
//para colocar y utilizar la configuración, colocamos el motor de plantillas     
app.set('view engine','.hbs');
//FINAL DE SETTINGS


//MIDDLEWARE
//secciones que serán ejecutadas antes que lleguen al servidor o cuando lleguen, antes de pasarlo a las rutas
app.use(express.urlencoded({extended:false}));//cuando me envien un form, poder entenderlo
//para que los fomr ocupen otros metodos, por ahora enviaremos un input oculto con nombre __method
app.use(methodOverride('_method'));

//modulo de sesion
app.use(session({
    secret:'mysecretapp',
    resave: true,
    saveUninitialized: true
}));

//Moddleware de passport
app.use(passport.initialize());
app.use(passport.session());

//ocupamos flash
app.use(flash());//con esto ya podemos enviar mensajes

//FIN DE MIDDLEWARES

//GOBAL VARIABLES
//colodar datos que queremos que toda la app tenga accesible
app.use((req,res,next)=>{
 res.locals.success_msg = req.flash('success_msg');
 res.locals.error_msg = req.flash('error_msg');
 res.locals.error = req.flash('error');
 res.locals.user = req.user||null;//tendrá como valor lo que el user ha autenticado
//cuando passport autentica un usuario, este guarda la info de ese usuario en un 
//objeto dentro de req, aquí podemos usarla globalmente

 next();//ya q node es de un solo hilo, ponemos el next al final de la función.
});
//ROUTES, le hago saber al servidor que aquí están mis rutas, asegurarse que no estén vacíos los archivos
app.use(require('./routes/index'));// encuentra el index.js
app.use(require('./routes/notes'));// encuentra el notes.js
app.use(require('./routes/users'));// encuentra el users.js  SIGNIN & SIGNUP .hbs
//app.use(require('./routes/testangel'));// test a ver si encuentra  REQUIERE MIDDLEWARE FUNCTION!!!
// Static Files
app.use(express.static(path.join(__dirname,'public')));//css
//SERVER I Listenning
app.listen(app.get('port'), ()=>{
 console.log('SERVER ON PORT', app.get('port'));
});
