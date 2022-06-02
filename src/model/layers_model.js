import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const layersSchema = new Schema({
    layer_name : {type: String}
}, {timestamps: true})

export default mongoose.model('Layer', layersSchema, 'layers')