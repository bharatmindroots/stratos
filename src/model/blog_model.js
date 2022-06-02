import mongoose from 'mongoose';
import Prompt from './prompt_model';
import User from './user_model';
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    blog: {type:String},
    prompts: [{type: 'ObjectId', ref:'Prompt'}],
    users: [{type: 'ObjectId', ref:'User'}],
}, {timestamps: true})

export default mongoose.model('Blog', blogSchema, 'blogs')



