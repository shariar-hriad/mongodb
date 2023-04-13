import mongoose from 'mongoose'
import modelOptions from './model.options.js'

const { Schema } = mongoose

const blogSchema = new Schema(
    {
        title: String,
        author: String,
        body: String,
        comments: [{ body: String, date: Date }],
        date: {
            type: Date,
            default: Date.now,
        },
        hidden: Boolean,
        meta: {
            votes: Number,
            favs: Number,
        },
    },
    modelOptions
)

const Blog = mongoose.model('Blog', blogSchema)

export default Blog
