import { Router } from 'express';
import { fetchAllBlogs, addBlog, updateBlog, blogById, deleteBlog, blogByUserId } from '../controllers/blog.controller.js';

const blogRouter = Router();

blogRouter.get("/fetchAllBlogs", fetchAllBlogs);
blogRouter.get("/fetchBlog/:blogId", blogById);
blogRouter.get("/usersBlog/:userId", blogByUserId);
blogRouter.post("/addBlog", addBlog);
blogRouter.put("/updateBlog/:blogId", updateBlog);
blogRouter.delete("/deleteBlog/:blogId", deleteBlog);

export default blogRouter;