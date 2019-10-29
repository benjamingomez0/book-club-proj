const express = require('express');
const router = express.Router();
const User = require('../models/users.js')
const bcrypt = require('bcryptjs');


//User Registration 
router.post('/registration', async (req, res) => {
  
    const password = req.body.password; 
    //salting the string
    const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  
    const userDbEntry = {};
    userDbEntry.username = req.body.username;
    userDbEntry.password = passwordHash;
    userDbEntry.email    = req.body.email;
    userDbEntry.about    = req.body.about;
    userDbEntry.fname    = req.body.fname;
    userDbEntry.lname    = req.body.lname;
    userDbEntry.genres = [];

    //adding genres to user.genres array
    if(req.body.genres)
    {
        for(let i= 0; i<req.body.genres.length;i++)
        {
            userDbEntry.genres.push(req.body.genres[i]);
        }
    }
    userDbEntry.photo    = req.body.photo;
  
    // adding the user to the db
    const createdUser = await User.create(userDbEntry);

//    console.log(createdUser, "<*=*=*=*=*= created user");
    req.session.username = createdUser.username;
    req.session.loggedIn = true;
  
    res.render('../views/users/usersShow.ejs',{
        user: createdUser
    })
  });

  //new user page display

  router.get('/new', (req,res)=>{
    res.render('../views/users/usersNew.ejs')
  });

  // auth login 
  router.post('/login', async (req, res) => {
    // find if the user exits
    try 
    {
      const foundUser = await User.findOne({username: req.body.username});
      // if User.findOne returns null/ or undefined it won't throw an error
      if(foundUser)
      {
  
          // comparee thier passwords
          if(bcrypt.compareSync(req.body.password, foundUser.password))
          {
            // if true lets log them in
            // start our session
            req.session.message = '';
            // if there failed attempts get rid of the message
            // from the session
            req.session.username = foundUser.username;
            req.session.logged   = true;
  
            res.render('../views/users/usersShow.ejs',
            {
                user:foundUser,
                message: req.session.message
            })
  
  
          }
        else
        {
              // if the passwords don't match
             req.session.message = 'Username or password is incorrect';
             res.redirect('/auth/login');
        }
  
  
      }
      else 
      {
  
        req.session.message = 'Username or password is incorrect';
        res.redirect('/auth/login');
        //  is where the form is
      }
  
    }
    catch(err)
    {
      res.send(err);
    }

  });

  router.get('/login',(req,res)=>{
        res.render('../views/users/login.ejs',
        {message:req.session.message});
  });
  

  module.exports = router;