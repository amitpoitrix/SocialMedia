import mongoose from 'mongoose';
import Blog from '../model/blog.model.js';
import User from '../model/user.model.js'

/** Fetching All Blogs */
export const fetchAllBlogs = async (req, res, next) => {
    let blogs;
    try {
        blogs = await Blog.find();
    } catch (error) {
        return next(error);
    }

    if(!blogs || (Array.isArray(blogs) && blogs.length === 0)) {
        return res.status(404).json({message: "No blogs found"});
    }

    return res.status(200).json({blogs});
}

/** Adding Blogs */
export const addBlog = async(req, res, next) => {
    const {title, image, description, user} = req.body;

    let existingUser;
    try {
        existingUser = await User.findById(user);
    } catch (error) {
        return next(error);
    }

    if(!existingUser) {
        return res.status(404).json({message: "User not found for the associated blog"});
    }

    const blogInfo = new Blog({
        title,
        image,
        description,
        user
    });

    // Now saving both blog data and updating existing user associated blog simultaneously
    try {
        // Start a session
        const session = await mongoose.startSession();
        // start transaction inside session
        session.startTransaction();

        // Save the blog and update the user within the transaction
        await blogInfo.save({session});

        existingUser.blogs.push(blogInfo);
        await existingUser.save({session});

        // Commit the transaction
        await session.commitTransaction();
        // end the session
        await session.endSession();
    } catch (error) {
        return next(error);
    }

    return res.status(201).json({message: "Blog successfully added", blogInfo});
}

/** Updating the blog by its id */
export const updateBlog = async(req, res, next) => {
    const blogId = req.params.blogId;

    const{ title, description } = req.body;

    let blog;
    try {
        blog = await Blog.findByIdAndUpdate(blogId, {
            title,
            description
        })
    } catch (error) {
        return next(error);
    }

    if(!blog) {
        return res.status(500).json({message: "Not able to update"});
    }

    return res.status(200).json({message: "Successfully updated"});
}

/** Fetching blog using blogId */
export const blogById = async (req, res, next) => {
    const blogId = req.params.blogId;

    let blog;
    try {
        blog = await Blog.findById(blogId);
    } catch (error) {
        return next(error);
    }

    if(!blog) {
        return res.status(404).json({messgae: "Blog not found"});
    }

    return res.status(200).json({blog});
}

/** Deleting a blog */
export const deleteBlog = async (req, res, next) => {
    const blogId = req.params.blogId;

    // Now along with deleting the blog we've to delete the blog from user also
    let blog;
    try {
        // while deleting blog we're using populate() to get the user object
        blog = await Blog.findByIdAndDelete(blogId).populate('user');
        // deleting the blog from that user - so that user won't be associated with this blog anymore
        await blog.user.blogs.pull(blog);
        // saving the user data after deleting the blog from its data
        await blog.user.save();
    } catch (error) {
        return next(error);
    }

    if(!blog) {
        return res.status(500).json({messgae: "unable to delete the blog"});
    }

    return res.status(200).json({message: "Blog deleted succesfully"});
}

/** Fetching user's blog by userId */
export const blogByUserId = async (req, res, next) => {
    const userId = req.params.userId;

    let usersBlog;
    try {
        usersBlog = await User.findById(userId).populate('blogs');
    } catch (error) {
        return next(error);
    }

    if(!usersBlog) {
        return res.status(404).json({message: "No blog associated with the user"});
    }

    return res.status(200).json({usersBlog});
}