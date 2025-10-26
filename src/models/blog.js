import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    titleAr: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    contentAr: {
        type: String,
        required: true
    },
    published: {
        type: Boolean,
        default: false
    }
});

const Blog = mongoose.model("Blog", BlogSchema);

export default Blog;
