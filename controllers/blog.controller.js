import mongoose from 'mongoose'
import responseHandler from '../handlers/response.handler.js'
import Blog from '../models/blog.model.js'

// module scafolding
const blogController = {}

blogController.allblogs = async (req, res) => {
    try {
        const blogs = await Blog.find({})
        responseHandler.ok(res, blogs)
    } catch {
        responseHandler.error(res)
    }
}

blogController.post = async (req, res) => {
    try {
        const { title, author } = req.body

        const newBlog = await Blog.create({
            title,
            author,
        })

        responseHandler.created(res, newBlog)
    } catch {
        responseHandler.error(res)
    }
}

blogController.details = async (req, res) => {
    try {
        const { blog_id } = req.params

        const valid_id = mongoose.Types.ObjectId.isValid(blog_id)

        if (!valid_id) responseHandler.badrequest(res, 'Invalid Id')

        const blog = await Blog.findById({ _id: blog_id })

        if (!blog) responseHandler.notfound(res)

        responseHandler.ok(res, blog)
    } catch {
        responseHandler.error(res)
    }
}

blogController.updateBlog = async (req, res) => {
    try {
        const { blog_id } = req.params

        const valid_id = mongoose.Types.ObjectId.isValid(blog_id)

        if (!valid_id) responseHandler.badrequest(res, 'Invalid Id!')

        const existingBlog = await Blog.findById({ _id: blog_id })

        if (!existingBlog) responseHandler.notfound(res)

        const blog = await Blog.findOneAndUpdate({ _id: blog_id }, { ...req.body })

        responseHandler.ok(res, blog)
    } catch {
        responseHandler.error(res)
    }
}

blogController.deleteBlog = async (req, res) => {
    try {
        const { blog_id } = req.params
        const valid_id = mongoose.Types.ObjectId.isValid(blog_id)

        if (!valid_id) responseHandler.badrequest(res, 'Invalid Id!')

        const existingBlog = await Blog.findById({ _id: blog_id })

        if (!existingBlog) responseHandler.notfound(res)

        if (existingBlog) {
            const deletedBlog = await Blog.findOneAndDelete({ _id: blog_id })

            responseHandler.ok(res, deletedBlog)
        }
    } catch {
        responseHandler.error(res)
    }
}

export default blogController
