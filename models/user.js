import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    fullname: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    follower: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER",
        default: [],
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER",
        default: [],
      },
    ],
    profileImg: {
      type: String,
      default: "",
    },
    coverImg: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
    isVerified:{
      type:Boolean,
      default:false
    },
    verificationCode:String
  },
  { timestamp: true }
);

const User = mongoose.model('USER',userSchema);
export default User
