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
    /***************************************************************************/
    userDbEntry.genres    = req.body.genres; //Q: how does this work for arr?
    /***************************************************************************/
    userDbEntry.photo    = req.body.photo;
    console.log(userDbEntry);
    // adding the user to the db
    const createdUser = await User.create(userDbEntry);
   console.log(createdUser);
    req.session.username = createdUser.username;
    req.session.logged = true;
  
    res.render('../views/users/usersShow.ejs')
  });

  module.exports = router;