const helpers = {}; //será un objeto con multiples funciones

//un middleware es una función que se ejecuta dependiendo de lo que le pasemos.
helpers.isAuthenticated = (req,res, next) =>{
if(req.isAuthenticated()){//si el user se ha logeado retorna true, contraio false.
    return next();
}
req.flash('error_msg','Not Authrized');
res.redirect('/users/signin');
}; //es un middleware tambien

//RECORDAR USAR EN NOTES DESPUES DE DEFINIR ESTA FUNCION
module.exports = helpers;