const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


const userSchema = new mongoose.Schema({
    
email: {
    type:String,
    required:true, 
    unique:true,
    trim:true,
},

password: {
    type:String,
    required:true, 
    minLen: 8, 
    maxLen: 15,
    trim:true,
},

post :  [ObjectId],


followers :  [ObjectId],

followerCount : {
    type : Number,
    default : 0
},

following :  [ObjectId],

followingCount : {
    type : Number,
    default : 0
}

},{ timestamps:true }

)

module.exports=mongoose.model("User", userSchema);