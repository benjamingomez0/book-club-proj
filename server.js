const express = require('express');
const app     = express();
require('dotenv').config()
const PORT = process.env.PORT

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
app.use(express.static('public'))



//homepage

app.get('/',function(req,res){
    
    
    try{
        if(req.session.loggedIn)
            {
                res.render('index.ejs',
                    {
                        message:req.session.message,
                        loggedIn: req.session.loggedIn
                    });
                
            }
        else
            {
                res.render('index.ejs',
                {message:req.session.message,
                loggedIn: false});
            }
        
    }
    catch(err)
    {
        
        res.send(err)
    }

});

//mounting routers
const usersController = require('./controllers/users.js');
app.use('/auth', usersController);

const clubsController = require('./controllers/clubs.js')
app.use('/clubs', clubsController);


app.listen(PORT, ()=>{
    console.log(`listening on PORT ${PORT}...`)
})