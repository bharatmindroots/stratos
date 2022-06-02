import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const otpSchema = new Schema({
    email : {type: String},
    otp : {type: Number},
    createdAt: { type: Date, default: Date.now, index: { expires: 600 } }

},{
    usePushEach: true,
  },)

export default mongoose.model('Otp', otpSchema, 'otps')