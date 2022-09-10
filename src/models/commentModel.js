const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


const commentSchema = new mongoose.Schema({
    
userId: ObjectId,

postId :  ObjectId,

comment : String,

isDeleted : {
    type : Boolean,
    default : false
}

},{ timestamps:true }

)

module.exports=mongoose.model("Comment", commentSchema);