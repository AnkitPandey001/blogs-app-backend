import User from "../models/user.js"
import Post from "../models/postSchema.js";

import Notification from "../models/notification.js";
import bcrypt from 'bcrypt'


export const getUserProfile = async (req,res)=>{
  try {
    const { username } = req.params; 
    //console.log(username);
    const user = await User.findOne({username}).select("-password");
    const posts = await Post.find({ user: req.user._id });

   if(!user){
       return res.status(404).json({
        error:"user Not found"
       })
   }
   
   res.status(200).json({user,posts});
    
  } catch (error) {
    return res.status(404).json({
        error:"Internal Server Error"
       })
  }
   
}

export const FollowAndunFollowUser = async(req,res)=>{
    try {

        const{id} = req.params;
        //console.log(id)
        const userModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);
        
        if(id===req.user._id.toString()){
            return res.status(404).json({
                error:"Can't follow/unfolow to own account"
               })
        }

        if(!userModify || !currentUser){
            return res.status(404).json({
                error:"User to Found"
               })
        }

       const isFollowing = currentUser.following.includes(id);

       if(isFollowing){
  
        await User.findByIdAndUpdate(id,{$pull:{follower:req.user._id}});
        await User.findByIdAndUpdate(req.user._id,{$pull:{following:id}})
         
        res.status(200).json({
            message:"user unfollow sucessfully"
        })

       }else{
       
        await User.findByIdAndUpdate(id,{$push:{follower:req.user._id}});
        await User.findByIdAndUpdate(req.user._id,{$push:{following:id}})
     
        const newNotification = new Notification({
            type:"Follow",
            from:req.user._id,
            to:userModify._id
        })

        await newNotification.save();

        res.status(200).json({
            message:"user follow sucessfully"
        })

       }
    
    } catch (error) {
        return res.status(404).json({
            error:"Internal Server Error"
           })
    }
}

export const getSuggestedUser = async (req,res) =>{
    try {

     const currentUser = await User.findById(req.user._id).select("following");
     if (!currentUser) {
        return res.status(404).json({
            error: "User not found"
        });
    }
    const followingList = currentUser.following;

    const allUsers = await User.find({ _id: { $nin: [...followingList, req.user._id] } }).select("-password");
   
    if (allUsers.length === 0) {
        return res.status(200).json({
            message: "No users to suggest"
        });
    }
    const suggestedUsers = allUsers.slice(0,3);

    res.status(200).json(suggestedUsers); 

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

export const updateProfile = async (req, res) => {
    let { fullname, username, email, currentPassword, newPassword, bio, link } = req.body;
    let { profileImg, coverImg } = req.body;

    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return res.status(404).json({
                error: "Provide both current and new password",
            });
        }

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);

            if (!isMatch) {
                return res.status(404).json({
                    error: "Current password is incorrect",
                });
            }

            if (newPassword.length < 6) {
                return res.status(404).json({
                    error: "Password must have a minimum length of 6 characters",
                });
            }

            user.password = await bcrypt.hash(newPassword, 10);
        }

        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        await user.save();
        user.password = null; 

        return res.status(200).json({
            user,
            message: "Profile updated successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error",
        });
    }
};



