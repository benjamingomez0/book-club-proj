const mongoose = require('mongoose')

const clubSchema = new mongoose.Schema({
        leader: {type: mongoose.Schema.Types.ObjectId,
        ref: 'User'},
        members:[{type: mongoose.Schema.Types.ObjectId,
            ref: 'User'}],
        numMembers:Number,
        book:String,
        location:String,
        genres:[String],
        readBy:Date
})
const Club = mongoose.model('Club', clubSchema);

module.exports = Club;