
import User from "../models/user.js"
import bcrypt from 'bcrypt'
import { generateJwtToken } from "../jwt/Jwt.js";
import Post from "../models/postSchema.js";
import { SendCode, Welcome } from "../middleware/SendCode.js";


//! handling user Signup here 

export const Signup = async(req,res)=>{
   try {
        const{username,fullname,password,email} = req.body;
        
        if(!username || !fullname || !password || !email){
            return res.status(400).json({
                error: "All fields are required",
              });
        }

        const existingUsername = await User.findOne({username})
        if(existingUsername){
            return res.status(409).json({
                error: "Username already taken",
              });
        }

        const existingEmail = await User.findOne({email})
        if(existingEmail){
            return res.status(409).json({
                error: "Email already taken",
              });
        }

        const hashPassword = await bcrypt.hash(password,10);
        
        const verificationCode = Math.floor(100000+Math.random()*900000).toString()

        const newUser = new User({
            username,
            fullname,
            password:hashPassword,
            email,
            verificationCode
        })
        
        if(newUser){
          SendCode(newUser.email,verificationCode)
            await newUser.save();
            res.status(200).json({
                user:newUser,
                message:"Account Created Sucesfully"
            })
        }
        else{
            res.status(400).json({
                error:"Invalid User details"
            })
        }

   } 

   catch (error) {
    console.log(error);
    res.status(500).json({
        error:"Internal server error"
    })

   }
}

export const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;

    const user = await User.findOne({ verificationCode: code });
    if (!user) {
      return res.status(404).json({
        error: "Invalid verification code",
      });
    }

    user.isVerified = true;
    user.verificationCode = undefined;

    await user.save();
    await Welcome(user.email, user.fullname);

    res.json({
      message: "Email verified successfully Please Login",
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};




//! handling user Login here

export const Login = async(req,res)=>{
    try {

        const { username, password } = req.body;
      //  console.log({ username, password });
    
        if (!username || !password) {
          return res.status(400).json({
            message: "username or password required"
          });
        }
    
        const existUser = await User.findOne({ username });
        if (!existUser) {
          return res.status(404).json({ message: "User not found" });
        }
    
        const isPasswordValid = await bcrypt.compare(password, existUser.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid password" });
        }

       const token =   generateJwtToken(existUser._id,res);
        //  console.log(token)
         
        res.status(200).json({
            user:existUser,
            message:"Login Sucess",
            token:token
        })

    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            message:"Internal server error"
        })
    
       }
}          


//! handling user Logout here

export const Logout = (req,res)=>{
   try {

    res.cookie('jwt',"",{maxAge:0});
    res.status(200).json({
        message:"Logout Sucessfull"
    })
    
   } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "Internal server error during logout"
      });
   }
}

//! -- getuser
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate({
        path: 'following',
        select: 'fullname username profileImg',
      })
      .populate({
        path: 'follower',
        select: 'fullname username profileImg',
      });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const posts = await Post.find({ user: req.user._id });

    res.status(200).json({
      user,
      posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server error",
    });
  }
};


export const deleteAccount = async(req,res)=>{
    const deleteAccount = req.user._id;

    try {
      if (!deleteAccount) {
        return res.status(404).json({
          error: "User not found"
        });
      }
  
      await User.findByIdAndDelete(deleteAccount);
  
      return res.status(200).json({
        message: "Account Deleted"
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Internal Server error"
      });
    }
}
