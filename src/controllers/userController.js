
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const bcrypt = require('bcrypt');
const { isValidRequestBody, isValid, isValidEmail, isValidPassword, isValidObjectId } = require("../utilities/validators");





//---USER LOGIN
const userLogin = async function(req,res){
    try {
//==validating request body==//
     let requestBody = req.body
    if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, msg: "Please provide details"})  
    let { email, password } = requestBody;

//==validating email==//
    if (!isValid(email)) return res.status(400).send({ status: false, msg: "email is required" })
    if (!isValidEmail(email)) return res.status(400).send({ status: false, msg: `${email} is not valid` })
       
//==validating password==//
    if(!isValid(password))return res.status(400).send({status:false, message: `Password is required`})
    if (!isValidPassword(password)) return res.status(400).send({ status: false, msg: `Password must include atleast one special character[@$!%?&], one uppercase, one lowercase, one number and should be mimimum 8 to 15 characters long` })
 
    
//==finding userDocument==//      
    const user = await userModel.findOne({ email });
if(user){
    //==if user exist==//
    const isLogin = await bcrypt.compare(password, user.password).catch(e => false)
    if (!isLogin) return res.status(401).send({ status: false, message: `wrong email address or password` });
}
else{
    //==if user not exist==//
//==password hashing==//
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
        
//==creating user==//    
    let userData = { email,password };
    const saveUser = await userModel.create( userData);
}
//==creating token==//   
    let token = jwt.sign(
    {
        userId:  email.toString(),
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 96 * 60 * 60 //4days
    },
    "beFriends"
);
 
//==sending and setting token==// 
       res.header('Authorization',token);
       res.status(200).send({status:true, message:`User login successfully`, data:{token}});

   } catch (error) {
       res.status(500).send({status:false, message:error.message});
   }
}


//---FOLLOW USER
const followUser = async function(req,res){
    try{
    
     let requestBody = req.body
     let userEmail = req.email

     let user = await userModel.findOne({ email : userEmail });
     if(!user ) return res.status(404).send({ status : false, msg : "User not found" });
    let userId = user._id; 

    //==validating request body==//
     if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, msg: "Please provide details"})  
     let { followId } = requestBody;

    //==validating followId==//
    if (!isValidObjectId(followId)) return res.status(400).send({ status: false, message: "Id is not a valid" });

    let follow = await userModel.findById({_id : followId} )
    if(!follow ) return res.status(404).send({ status : false, msg : "User not found" });

    //==checking if already following or not==//
    let temp = user.following, isIdPresent = false;
    for(let i=0;i<temp.length;i++){
        if(temp[i].toString()===followId.toString()){
             isIdPresent = true;
             break;
            }
    }
    if(isIdPresent) return res.status(400).send({status : false,msg : "Already following user"});

    //==updating userDocument==//
    let updateUser = {}
    user.following.push(followId);
    updateUser.following = user.following;
    updateUser.followingCount = user.followingCount + 1;
    let follow1 = await userModel.findByIdAndUpdate( { _id: userId }, updateUser, { new: true } );

    //==updating follow document==//
    let updateData = {}
    follow.followers.push(userId)
    updateData.followers = follow.followers;
    updateData.followerCount = follow.followerCount + 1;
    follow = await userModel.findByIdAndUpdate( { _id: followId }, updateData, { new: true } );

    //==sending succesfull response==//
    return res.status(200).send({ status: true, msg : "Successfully following"})    
    }catch(err){
        res.status(500).send({status:false, message:err.message});
    }
}

//========================================================================================================//

//---UNFOLLOW USER
const unfollowUser = async function(req,res){
    try{
     let requestBody = req.body
     let userEmail = req.email

     let user = await userModel.findOne({ email : userEmail });
     if(!user ) return res.status(404).send({ status : false, msg : "User not found" });
    let userId = user._id; 

    //==validating request body==//
     if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, msg: "Please provide details"})  
     let { followId } = requestBody;

    //==validating followId==//
    if (!isValidObjectId(followId)) return res.status(400).send({ status: false, message: "Id is not a valid" });

    let follow = await userModel.findById({_id : followId} )
    if(!follow ) return res.status(404).send({ status : false, msg : "User not found" });

    //==checking if already following or not==//
    let temp = user.following, isIdPresent = false, remove 
    for(let i=0;i<temp.length;i++){
        if(temp[i].toString()===followId.toString()){
             remove = i;
             isIdPresent = true;
             break;
            }
    }
    if(!isIdPresent) return res.status(400).send({status : false,msg : "Not following user"});

//==updating userDocument==//
let updateUser = {}
user.following.splice(remove,1);
updateUser.following = user.following;
updateUser.followingCount = user.followingCount - 1;
let follow1 = await userModel.findByIdAndUpdate( { _id: userId }, updateUser, { new: true } );


let temp1 = follow.followers, remove1 
    for(let j=0;j<temp.length;j++){
        if(temp1[i].toString()===userId.toString()){
             remove1 = j;
             break;
            }
    }

//==updating follow document==//
let updateData = {}
follow.followers.splice(remove1,1)
updateData.followers = follow.followers;
updateData.followerCount = follow.followerCount - 1;
follow = await userModel.findByIdAndUpdate( { _id: followId }, updateData, { new: true } );

//==sending succesfull response==//
return res.status(200).send({ status: true, msg : "Successfully unfollow"}); 
}catch(err){
    res.status(500).send({status:false, message:err.message});
    }
}


//========================================================================================================//


const getUser = async function(req,res){
    try{
        let userEmail = req.email;
        let user = await userModel.findOne({ email : userEmail }).select({ _id : 0, email : 1, followerCount : 1, following : 1 });
        if(!user ) return res.status(404).send({ status : false, msg : "User not found" });
        
        //==sending succesfull response==//
        return res.status(200).send({ status: true, msg : "Successfull", data : user }) 

    }catch(err){
    res.status(500).send({status:false, message:err.message});
    }
}




//========================================================================================================//

module.exports = { userLogin, followUser, unfollowUser, getUser}

//========================================================================================================//