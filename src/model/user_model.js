import mongoose from 'mongoose';
import Layer from './layers_model';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: {type: String},
    image: {type: String},
    last_name: {type: String},
    dob: {type: Date},
    city: {type: String},
    email: {type: String, unique: true},
    password : {type: String},
    job: [{job_title: String, comapny_name: String, job_duration: Date, level: String}],
    layers: [{type: 'ObjectId', ref:'Layer'}],
    login_type: {type: String},
    social_token: {type: String},
    role: {type: String, default: 'user'}
}, {timestamps: true})

export default mongoose.model('User', userSchema, 'users')