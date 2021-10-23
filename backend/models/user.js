import mongoose from 'mongoose';

const {Schema} = mongoose;

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    status: {type: String, default: 'New user'},
    posts : [{
        type: Schema.Types.ObjectId,
        ref: 'Post',
    }]
})

export default mongoose.model('User',userSchema);