const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


const postSchema = new mongoose.Schema({
    
userId: ObjectId,

title: {
    type:String,
    required:true, 
    unique:true,
    trim:true,
},

description: {
    type:String,
    required:true, 
    trim:true,
},

comments : [ObjectId],

like : [ObjectId],

likes : {
    type : Number,
    default : 0
},

commentsCount : {
    type : Number,
    default : 0
},

isDeleted : {
    type : Boolean,
    default : false
}

},{ timestamps:true }
)

module.exports=mongoose.model("Post", postSchema);