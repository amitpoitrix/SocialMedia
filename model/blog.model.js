import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    // blog -> user (one to one mapping) as blog can be associated with just 1 user
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

export default mongoose.model('Blog', blogSchema);
