import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const promptSchema = new Schema({
    prompt_title: {type:String}
}, {timestamps: true})

export default mongoose.model('Prompt', promptSchema, 'prompts')