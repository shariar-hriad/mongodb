import express from 'express'
import blogController from '../controllers/blog.controller.js'

const router = express.Router()

router.get('/all-blogs', blogController.allblogs)

router.post('/post', blogController.post)

router.get('/details/:blog_id', blogController.details)

router.put('/update-blog/:blog_id', blogController.updateBlog)

router.delete('/delete-blog/:blog_id', blogController.deleteBlog)

export default router
