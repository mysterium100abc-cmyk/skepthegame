import mongoose from "mongoose";
const { Schema } = mongoose;
const linkSchema = new Schema({
    link:{
        type: String,
        required:true,
        trim:true,
    }

},{timestamps:true});

const Link = mongoose.models.Link || mongoose.model('Link', linkSchema);
export default Link;
