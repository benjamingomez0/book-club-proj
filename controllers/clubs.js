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



router.get('/:genre', async(req,res)=>{
  
    await Club.find({"genres":req.params.genre}, (err,foundClubs)=>{

       
       res.render('../views/clubs/clubsIndex.ejs',{
                clubs:foundClubs,
                loggedIn: req.session.loggedIn})
            });
});


router.get('/clubsshow/:id/', async(req,res)=>
{
    
    try{
        foundClub =  await Club.findById(req.params.id, (err, foundClub)=>{
                res.render('../views/clubs/clubsShow.ejs',{
                    loggedIn: req.session.loggedIn,
                    club:foundClub,
                    sessionUser:req.session.username,
                    userId: req.session.userId
            });
        });
    }
    catch(err)
    {
        console.log(err);
    }
});

    

    router.get('/edit/:id', async(req,res)=>{
        try{
            foundClub =  await Club.findById(req.params.id, (err, foundClub)=>{
                res.render('../views/clubs/clubsEdit.ejs',{ loggedIn: req.session.loggedIn, club:foundClub });
        });
           
        }
        catch(err)
        {
            console.log(err)
        }
    });

    
    router.put('/join/:id', async(req,res)=>{
        const  foundUser= await User.findOne({username: req.session.username});
        console.log
        const foundClub= await Club.findById(req.params.id)
        foundClub.members.push(foundUser._id);
        foundClub.save();
        res.render('../views/clubs/clubsShow.ejs',
            {
                    club:foundClub,
                    loggedIn:req.session.loggedIn,
                    sessionUser:req.session.username,
                    user:foundUser,
                    userId:req.session.userId

                });
            
            
        });
        

        router.put('/:id', async(req,res)=>{
                try
                {
                    const  foundUser= await User.findOne({username: req.session.username});
                    Club.findByIdAndUpdate(req.params.id, req.body, {new:true}, async (err,updatedClub)=>{
                        if(err)
                        {
                        console.log(err)
                        }
                        else
                        {
                            res.render('../views/clubs/clubsShow.ejs',
                            {
                                club:updatedClub,
                                loggedIn:req.session.loggedIn,
                                sessionUser:req.session.username,
                                userId:foundUser
                            
                            });
                            
                        }
        
                        });
                }
        
                catch(err)
                {
                    console.log(err);
                }
        
            });
        
        
    router.delete('/:id', async (req,res)=>{
  
        const deletedClub = await Club.findByIdAndRemove(req.params.id)
        
        await Club.find({},(err, allClubs)=>{ 
            res.render('../views/clubs/clubsIndex.ejs',{clubs: allClubs,loggedIn: req.session.loggedIn}) 
        });        
    })
        
        
 module.exports = router;
