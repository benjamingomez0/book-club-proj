const express = require('express');
const router = express.Router();
const User = require('../models/users.js');
const Club = require('../models/clubs.js');

//creating new club
router.get('/new', (req,res)=>{
    try
    {
        res.render('../views/clubs/clubsNew.ejs',
        {loggedIn:req.session.loggedIn})
    }
    catch(err)
    {
        console.log(err);
    }
    
});


router.post('/create-club',  async (req,res)=>{
    try
    {
             
        const createdClub = {};

        createdClub.leader = req.session.userId;
        createdClub.members=[];
        createdClub.members.push(req.session.userId);
        createdClub.numMembers = parseInt(req.body.numMembers);
        createdClub.book = req.body.book;
        createdClub.location= req.body.location;
        createdClub.readBy= Date.parse(req.body.readBy);
        createdClub.genres=[];
        
        if(req.body.genres)
        {
            for(let i= 0; i<req.body.genres.length;i++)
            {
                createdClub.genres.push(req.body.genres[i]);
            }
        }
        
       await Club.create(createdClub);
       
       await Club.find({},(err, allClubs)=>{

        res.render('../views/clubs/clubsIndex.ejs',{
            clubs: allClubs,
            loggedIn: req.session.loggedIn
            });

       });
       

        
    }
    catch(err)
    {
        console.log(err);
    }

});

// show route
router.get('/', async (req,res)=>{
    await Club.find({},(err, allClubs)=>{ 
        res.render('../views/clubs/clubsIndex.ejs',{clubs: allClubs,loggedIn: req.session.loggedIn}) 
    });
});


/************************************************************************************/
router.get('/:genre', async(req,res)=>{
    console.log(req.params,"<=======req.params")
    await Club.find({genre:req.params}, (err,foundClubs)=>{

        console.log(foundClubs, "<========clubs index found clubs") //// HOW DO I SEARCH IN THE CLUBS ARRAY?

       res.render('../views/clubs/clubsIndex.ejs',{
                clubs:foundClubs,
                loggedIn: req.session.loggedIn})
            });
});
/************************************************************************************/

 module.exports = router;
