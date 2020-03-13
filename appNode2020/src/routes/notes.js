const express= require('express');
const router = express.Router();

//funciones de la DB en CRUD
const Note = require('../models/Note');// gracias a esto podemos decir que queremos insertar un nuevo dato
const {isAuthenticated} = require('../helpers/auth');

router.get('/notes/add', isAuthenticated,(req,res)=>{
 res.render('notes/new-note');
});

/*recibimos los datos de la nueva nota del formulario
manejamos los datos por medio de una función para recibirlos,
cuando se reciban mostramos los datos para ver si se están 
recibiendo
*/
//CREATE
router.post('/notes/new-note',isAuthenticated, async (req,res)=>{
   const {title, description}=req.body;//propiedad que da la misma función
    const cagadas = [];
    if (!title) {
        cagadas.push({text:'Please insert a new Title'});
    }
    if (!description) {
        cagadas.push({text:'Plese insert a new Description'});
    }
    if (cagadas.length > 0) {
        res.render('notes/new-note',{
            cagadas,
            title,
            description
        });
    }else{//si todo sale bien almacenamos en la DB con el modelo de datos creado en la carpeta models
       const newNote = new Note({title, description});
       //newNote.save().then(); //hay que decirle que sea una peticion asincrona
       //para asincrono ponemos async en la función inicial [router.postasync(req,res)]
       newNote.user = req.user.id;/*
            Usamos este req.user.id porque al momento que passport ha 
            autenticando al usuario lo está guardando dentro de req.user
            todos los datos del user, pero solo nos interesa el id.
        */
      await newNote.save();//con await ya sabe el codigo que debe de esperar a que se ejecute la linea 
      //y despues seguirá con el resto de codigo que esté debajo.
      //usamos un mensaje de FLASH
       req.flash('success_msg','Note Added Successfully');
       res.redirect('/notes')
    }
    
});

//CONSULTAR en la db
router.get('/notes',isAuthenticated, async(req,res)=>{
   const notes = await Note.find({user:req.user.id}).sort({date:'desc'}).lean();
   res.render('notes/all-notes',{notes});
});

//EDITAR
router.get('/notes/edit/:id',isAuthenticated, async(req,res)=>{
   const note = await Note.findById(req.params.id).lean();
    res.render('notes/edit-note',{note});
});

router.put('/notes/edit-note/:id',isAuthenticated, async(req,res)=>{
   const {title, description} = req.body;
   await Note.findByIdAndUpdate(req.params.id,{title,description});
   req.flash('success_msg','Note Updated Successfully');
   res.redirect('/notes');
});

//DELETE
router.delete('/notes/delete/:id',isAuthenticated, async(req,res)=>{
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg','Note Deleted Successfully');
    res.redirect('/notes');
});

module.exports = router;