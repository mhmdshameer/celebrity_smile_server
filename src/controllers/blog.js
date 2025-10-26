import Blog from "../models/blog.js";

// Create Blog
export const createBlogPost = async (req, res) => {
    try {
        const blog = new Blog(req.body);
        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Blogs
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate({
                path: 'authorId',
                select: 'name nameAr image',
                model: 'Doctor'
            });
            
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Single Blog
export const getBlogPost = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate({
                path: 'authorId',
                select: 'name nameAr image',
                model: 'Doctor'
            });
            
        if (!blog) {
            return res.status(404).json({ error: 'Blog post not found' });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Blog
export const updateBlogPost = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Blog
export const deleteBlogPost = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

