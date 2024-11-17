import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
      text: {
        type: String,
        required: true,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER',
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

const postShema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'USER',
            required:true
        },
        text:{
            type:String
        },
        img:{
            type:String
        },
        likes:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'USER'
            }
        ],
       comments: [commentSchema],
       category: {
        type: String,
        enum: ['coding', 'news', 'event'],
        required: true
       },
       title:{
        type: String,
        required:true
       }
    },
    {
        timestamps:true
    }
);

const Post = mongoose.model("Post",postShema);
export default Post;