import express from "express";
import { createBlogPost, deleteBlogPost, getAllBlogs, getBlogPost, updateBlogPost } from "../controllers/blog.js"; 

const router = express.Router();

router.post("/", createBlogPost);
router.get("/", getAllBlogs);
router.get("/:id", getBlogPost);
router.put("/:id", updateBlogPost);
router.delete("/:id", deleteBlogPost);

export default router;