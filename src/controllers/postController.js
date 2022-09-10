
const postModel = require("../models/postModel");
const userModel = require("../models/userModel");
const commentModel = require("../models/commentModel")
const { isValidRequestBody, isValid, isValidObjectId } = require("../utilities/validators");


const userPost = async function(req,res){
    try{
        let requestBody = req.body;
        let userEmail = req.email

        let user = await userModel.findOne({ email : userEmail });
        let userId = user._id;

//==validating request body==//
     if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, msg: "Please provide details"});  
     let { title, description } = requestBody;
 
//==validating title==//
     if (!isValid(title)) return res.status(400).send({ status: false, msg: "title is required" });
    let getPost = await postModel.findOne({title : title ,isDeleted : false} );
    if(getPost ) return res.status(404).send({ status : false, msg : "title is available" });

//==validating description==//
    if (!isValid(description)) return res.status(400).send({ status: false, msg: "description is required" });

//==creating post==//    
    let postData = { title, description, userId };
    const savePost = await postModel.create( postData);
    let sendData = {};
    sendData._id = savePost._id;
    sendData.title = savePost.title;
    sendData.description = savePost.description;
    sendData.createdAt = savePost.createdAt;

//==sending succesfull response==//
    return res.status(201).send({ status: true, msg : "Successfull", data : sendData }); 

}catch(error) {
       res.status(500).send({status:false, message:error.message});
   }
}

const deletePost = async function(req,res){
    try{
        let requestBody = req.body
        let userEmail = req.email
   
        let user = await userModel.findOne({ email : userEmail });
        if(!user ) return res.status(404).send({ status : false, msg : "User not found" });
       let userId = user._id; 
   
       //==validating request body==//
        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, msg: "Please provide details"})  
        let { postId } = requestBody;
   
       //==validating postId==//
       if (!isValidObjectId(postId)) return res.status(400).send({ status: false, message: "Id is not a valid" });
   
       let post = await postModel.findOne({_id : postId,isDeleted : false} )
       if(!post ) return res.status(404).send({ status : false, msg : "Post not found" });

       if( userId.toString() !== post.userId.toString()) return res.status(403).send({ status: false, msg:"Not authorize"});

       let postRemove = await postModel.findByIdAndUpdate({ _id: postId }, { isDeleted : true }, { new: true } )

    //==sending succesfull response==//
        return res.status(200).send({ status: true, msg : "Successfully deleted"}); 

    }catch(error) {
       res.status(500).send({status:false, message:error.message});
   }
}

const likePost = async function(req,res){
    try{
        let requestBody = req.body
        let userEmail = req.email
   
        let user = await userModel.findOne({ email : userEmail });
        if(!user ) return res.status(404).send({ status : false, msg : "User not found" });
        let userId = user._id; 
   
       //==validating request body==//
        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, msg: "Please provide details"})  
        let { postId } = requestBody;
   
       //==validating postId==//
       if (!isValidObjectId(postId)) return res.status(400).send({ status: false, message: "Id is not a valid" });
   
       let post = await postModel.findOne({_id : postId,isDeleted : false} );
       if(!post ) return res.status(404).send({ status : false, msg : "Post not found" });

       let temp = post.like, isIdPresent=false;
       for(let i=0; i<temp.length;i++){
        if(temp[i].toString() === userId.toString()){
            isIdPresent = true;
            break;
           }
   }
   if(isIdPresent) return res.status(400).send({status : false,msg : "Already liked post"});

       let updateLike = {};
       post.like.push(userId)
       updateLike.like = post.like;
       updateLike.likes = post.likes + 1;

       let postUpdate = await postModel.findOneAndUpdate({_id : postId,isDeleted : false}, updateLike, { new: true } )

       //==sending succesfull response==//
       return res.status(200).send({ status: true, msg : "Successfully liked"});

    }catch(error) {
       res.status(500).send({status:false, message:error.message});
   }
}

const unlikePost = async function(req,res){
    try{
        let requestBody = req.body
        let userEmail = req.email
   
        let user = await userModel.findOne({ email : userEmail });
        if(!user ) return res.status(404).send({ status : false, msg : "User not found" });
        let userId = user._id; 
   
       //==validating request body==//
        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, msg: "Please provide details"})  
        let { postId } = requestBody;
   
       //==validating postId==//
       if (!isValidObjectId(postId)) return res.status(400).send({ status: false, message: "Id is not a valid" });
   
       let post = await postModel.findOne({_id : postId,isDeleted : false} );
       if(!post ) return res.status(404).send({ status : false, msg : "Post not found" });

       let temp = post.like, isIdPresent=false, remove;
       for(let i=0; i<temp.length;i++){
        if(temp[i].toString() === userId.toString()){
            remove = i;
            isIdPresent = true;
            break;
           }
   }
   if(!isIdPresent) return res.status(400).send({status : false,msg : "First Like post!"});

   let updateLike = {};
       post.like.splice(remove,1)
       updateLike.like = post.like;
       updateLike.likes = post.likes - 1;

       let postUpdate = await postModel.findOneAndUpdate({_id : postId,isDeleted : false}, updateLike, { new: true } )

       //==sending succesfull response==//
       return res.status(200).send({ status: true, msg : "Successfully unliked"});

    }catch(error) {
       res.status(500).send({status:false, message:error.message});
   }
}


const addComment = async function(req,res){
    try{
        let requestBody = req.body
        let userEmail = req.email
   
        let user = await userModel.findOne({ email : userEmail });
        if(!user ) return res.status(404).send({ status : false, msg : "User not found" });
        let userId = user._id; 
   
       //==validating request body==//
        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, msg: "Please provide details"})  
        let { postId, comment } = requestBody;
   
       //==validating postId==//
       if (!isValid(postId)) return res.status(400).send({ status: false, msg: "postId is required" });
       if (!isValidObjectId(postId)) return res.status(400).send({ status: false, message: "Id is not a valid" });
   

       if (!isValid(comment)) return res.status(400).send({ status: false, msg: "comment is required" });

       let post = await postModel.findOne({_id : postId,isDeleted : false});
       if(!post ) return res.status(404).send({ status : false, msg : "Post not found" });

       let updateData = {}
       updateData.userId = userId;
       updateData.comment = comment;
       updateData.postId = postId
       let commentSave = await commentModel.create(updateData);

       let updateComments = {};
       post.comments.push(commentSave._id);
       updateComments.comments = post.comments;
       updateComments.commentsCount = post.commentsCount + 1;

       let postUpdate = await postModel.findOneAndUpdate({_id : postId,isDeleted : false}, updateComments, { new: true } )

       //==sending succesfull response==//
       return res.status(201).send({ status: true, msg : "Successfull",data: commentSave._id});

    }catch(error) {
       res.status(500).send({status:false, message:error.message});
   }
}

module.exports = { userPost, deletePost, likePost, unlikePost, addComment };