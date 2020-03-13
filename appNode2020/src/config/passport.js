const passport = require('passport');//modulo para autenticar usuarios
const User = require('../models/Users');
//ya sea con google, github, pero en este caso será autenticación local.


const LocalStrategy = require('passport-local').Strategy;

// para definir una nueva estrategia de autenticación usamos
// passport.use

//pedimos los parámetros que quermos con los que autentique al usuario.
passport.use(new LocalStrategy({
    usernameField:'email'
},async(email,password,done)=>{
    const user = await User.findOne({email:email});
    if (!user) { 
        return done(null, false, {message:'Not user found.'});
        //si devolvemos null significa que no ha habido ningun error
        //si devolvemos false significa que no hay ningún usuario.
        //finalmente podemos enviar un  mensaje de vuelta.
    }else{console.log(user)
       const match = await user.matchPassword(password);//metodo de la instancia de la clase
       if (match) { console.log(user,password);
           return done(null, user);//null para el error y el usuario que está encontrando
       }else{// si es incorrecto pass & email 
        
            return done(null,false,{message: 'Incorrect Password'});
       }
    }
}));

//manera de guardar el usuario en una sesion
//otra confg que solicita passport es serializerUser
//toma un usuario y toma un callback
passport.serializeUser((user,done)=>{
    done(null,user.id);//si el usuario se loggeaba almacenamos en sesion su id
});

//hace lo contrario
passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        done(err,user);
    });
});

/*Para utilizar hacemos unas configuraciones en el index.js 
  el principal.
 */