const express = require('express');
const app     = express();
const PORT    = 3030;

//middleware requires
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');
const session        = require('express-session')

// connecting db to server
require('./db/db')

//session middleware
app.use(session({
        secret: "two may keep council putting one away",
        resave: false, 
        saveUninitialized: false 
}));

//middleware
app.use(methodOverride('_method'));//must come before our routes
app.use(bodyParser.urlencoded({extended: false}));



//homepage

app.get('/',function(req,res){
    try{
        res.render('index.ejs');
    }
    catch(err)
    {
        res.send(err)
    }

});






app.listen(PORT, ()=>{
    console.log('listening...')
})