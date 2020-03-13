const express = require('express');
const router = express.Router();
const passport = require('passport');

//pedimos el modelo de los usuarios
const User = require('../models/Users');

//las rutas de los usuarios nos ayudan autenticarlos
router.get('/users/signin',(req,res)=>{//Para Ingresar
 res.render('users/signin');//        con la cuenta
});

//Ruta del signin con POST
router.post('/users/signin', passport.authenticate('local',{
    successRedirect:'/notes',
    failureRedirect:'/users/signin',
    failureFlash:true //OJO de no escribir esto en comillas simples, o priorizará este mensaje a los programados en passport
}));

router.get('/users/signup',(req,res)=>{//para Registrarse
    res.render('users/signup');//
});

//a esta ruta vendrán los datos del formulario
router.post('/users/signup', async(req,res)=>{
const {name, email, password, confirm_password} = req.body;

const errors = [];
//console.log(req.body);

if (name.length <= 0 ) {
 errors.push({text:'Please write your name'});    
}
if (email.length <= 0) {
    errors.push({text:'Please write your email'});    
}
if (password.length <= 0) {
    errors.push({text:'Please werite your password'});    
}
if (confirm_password.length <= 0) {
    errors.push({text:'Please write confirm your password'});    
}

if (password != confirm_password) {
    errors.push({text:'Password do not Match'});
}

if (password.length < 4 || confirm_password.length < 4) {
    errors.push({text:'Both Passwords musts be at least 4 characters'});
}

if (errors.length > 0) {//console.log(errors)
    res.render('users/signup',{errors, name, email, password, confirm_password});
    
}else{//creamos el esquema en donde se guardaran estos datos
    //instanciamos  el modulo del usuario

    //validamos tambíen por si inserta un email repetido
    const emailUser = await User.findOne({email:email});
    if (emailUser) {
        req.flash('error_msg','The Email is already in use');
        res.redirect('/users/signup');
    }

    const newUser = new User({name, email, password});
    newUser.password= await newUser.encryptPassword(password);
    await newUser.save();
    req.flash('success_msg', 'You are Registred');
    res.redirect('/users/signin');//recuerda hacer la vista
}

});

// LOGOUT
router.get('/users/logout',(req,res)=>{
    req.logout();
    res.redirect('/index');
});

module.exports = router; 