import express from 'express'
import blogRoute from './blog.route.js'
import userRoute from './user.route.js'

const router = express.Router()

router.use('/user', userRoute)
router.use('/blog', blogRoute)

export default router
