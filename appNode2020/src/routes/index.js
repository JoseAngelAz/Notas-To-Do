const express= require('express');
const router = express.Router();

router.get('/index',(req,res)=>{
 res.render('index');
 //renderizará la plantilla hbs para este index desde la view
});

router.get('/about',(req,res)=>{
    res.render('about');
    //renderizará la plantilla hbs para este about desde la view
});
module.exports = router;