const express = require('express');
const router = express.Router();
const User = require('../models/users.js')
const Club = require('../models/clubs.js') 
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
    req.session.userId = createdUser._id

    const allClubs = await Club.find({"members":createdUser._id});

    res.render('../views/users/usersShow.ejs',{
        user: createdUser,
        loggedIn:req.session.loggedIn,
        clubs:allClubs 
    })
  });

  //new user page display

  router.get('/new', (req,res)=>{
    res.render('../views/users/usersNew.ejs',
    {
        loggedIn:req.session.loggedIn, 
        message:req.session.message
    });
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
            req.session.loggedIn   = true;
            req.session.userId = foundUser._id
            allClubs = await Club.find({"members":foundUser._id});
            res.render('../views/users/usersShow.ejs',
            {
                user:foundUser,
                message: req.session.message,
                loggedIn:req.session.loggedIn,
                clubs:allClubs
            
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
        {message:req.session.message,loggedIn:req.session.loggedIn});
  });


  router.get('/user', async (req,res)=>{
    try{
        const foundUser = await User.findOne({username: req.session.username});
       
        const userClubs = await Club.find({"members":foundUser._id});
        
        res.render('../views/users/usersShow.ejs',
        {
            user:foundUser,
            message: req.session.message,
            loggedIn:req.session.loggedIn,
            clubs:userClubs 
        
        });
    }
    catch(err)
    {
        console.log(err);
    }
  })


  router.get('/edit/:id', async (req,res)=>{
    try
    {
    foundUser = await User.findById(req.params.id, (err, foundUser) => {
        res.render('../views/users/userEdit.ejs', {
          user: foundUser,
          loggedIn:req.session.loggedIn,
        });
      });
    }
    catch(err)
    {
      console.log(err);
    }
});
  
router.put('/:id', async (req,res)=>{
    await User.findByIdAndUpdate(req.params.id, req.body, {new:true}, async (err,updatedUser)=>{
      if(err)
      {
        console.log(err)
      }
      else
      {
        req.session.username = updatedUser.username;
        const allClubs = await Club.find({"members":foundUser._id});

        res.render('../views/users/usersShow.ejs',
        {
            user:updatedUser,
            message: req.session.message,
            loggedIn:req.session.loggedIn,
            clubs:allClubs 
        
        });
        
      }
    });

});

router.get('/logout', (req, res) => {

  req.session.destroy((err) => {
    if(err){
      res.send(err);
    } else {
      res.redirect('/');
    }
  })

})

router.delete('/:id', async(req,res)=>{
  try
  {
    const deletedUser = await User.findByIdAndRemove(req.params.id)
    await Club.remove({leader: deletedUser});
   
    req.session.destroy((err) => {
    if(err)
    {
      res.send(err);
    } 
    else 
    {
      res.redirect('/');
    }
    });
  }
  catch(err)
  {
      console.log(err)
  }

});




  module.exports = router;