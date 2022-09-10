const express = require('express');
const router = express.Router();
const { authentication,authorization } = require("../middleware/auth");
const { userLogin, followUser, unfollowUser, getUser } = require('../controllers/userController');
const { userPost, deletePost, likePost, unlikePost, addComment } = require("../controllers/postController")


//============ USER API's =============//

//==Login User
router.post('/api/authenticate', userLogin);

//==Follow User
router.post('/api/follow',authentication, followUser);

//==Unfollow User
router.post('/api/unfollow',authentication, unfollowUser);

//==Get User
router.get('/api/user',authentication, getUser);


// //=========== POST API's ==============//

//==User Post
router.post('/api/posts',authentication, userPost);

//==Delete Post
router.delete('/api/posts',authentication, deletePost);

//==Like Post
router.post('/api/like', authentication, likePost);

//==Unlike Post
router.post('/api/unlike', authentication, unlikePost);

//==Add Comment
router.post('/api/comment', authentication, addComment);

// //==Get Post
// router.get('/api/posts', authentication, getPost);

// //==Get All Post
// router.get('/api/all_posts', authentication, getAllPost);


//**********************************************************************

   module.exports = router  

//*******************************************************************//