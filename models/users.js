const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
        username:{type:String, required:true, unique: true},
        password:{type:String, required:true},
        email:{type:String, required:true, unique: true},
        fname:String,
        lname:String,
        genres:[String],
        about:String,
        photo:String,
});

const User = mongoose.model('User', userSchema)

module.exports = User;