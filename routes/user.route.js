import express from 'express'
import { body } from 'express-validator'
import userController from '../controllers/user.controller.js'
import requestHandler from '../handlers/request.handler.js'
import hashPassword from '../middlewares/hash.middleware.js'
import tokenMiddleware from '../middlewares/token.middleware.js'
import User from '../models/user.model.js'

const router = express.Router()

// create a user
router.post(
    '/signup',
    hashPassword,
    body('username')
        .exists()
        .withMessage('username is required')
        .isLength({ min: 6 })
        .withMessage('username must be 6 characters')
        .custom(async (value) => {
            const user = await User.findOne({ username: value })
            if (user) return Promise.reject('username already exists')
        }),
    body('password')
        .exists()
        .withMessage('password is required')
        .isLength({ min: 6 })
        .withMessage('password must be 6 characters'),
    body('confirmPassword')
        .exists()
        .withMessage('confirmPassword is required')
        .isLength({ min: 8 })
        .withMessage('confirmPassword must be 8 characters')
        .custom((value, { req }) => {
            if (value !== req.body.password) throw new Error('confirmPassword not match')
            return true
        }),
    body('displayName')
        .exists()
        .withMessage('displayName is required')
        .isLength({ min: 8 })
        .withMessage('displayName must 8 characters'),
    requestHandler.validate,
    userController.sign_up
)

// sign in user
router.post(
    '/signin',
    body('username')
        .exists()
        .withMessage('username is required')
        .isLength({ min: 6 })
        .withMessage('username must be 6 characters'),
    body('password')
        .exists()
        .withMessage('password is required')
        .isLength({ min: 6 })
        .withMessage('password must be 6 characters'),
    requestHandler.validate,
    userController.sign_in
)

// update profile
router.get(
    '/update-profile',
    // tokenMiddleware.auth,
    // body('username')
    //     .exists()
    //     .withMessage('username is required')
    //     .isLength({ min: 6 })
    //     .withMessage('username must be 6 characters'),
    // body('password')
    //     .exists()
    //     .withMessage('password is required')
    //     .isLength({ min: 8 })
    //     .withMessage('password minimum 8 characters'),
    // body('newPassword')
    //     .exists()
    //     .withMessage('newPassword is required')
    //     .isLength({ min: 8 })
    //     .withMessage('newPassword minimum 8 characters'),
    // body('confirmNewPassword')
    //     .exists()
    //     .withMessage('confirmNewPassword is required')
    //     .isLength({ min: 8 })
    //     .withMessage('confirmNewPassword minimum 8 characters')
    //     .custom((value, { req }) => {
    //         if (value !== req.body.newPassword) throw new Error('confirmNewPassword not match')
    //         return true
    //     }),
    // requestHandler.validate,
    userController.update_profile
)

// update password
router.put(
    '/update-password/:userId',
    tokenMiddleware.auth,
    body('password')
        .exists()
        .withMessage('password is required')
        .isLength({ min: 6 })
        .withMessage('password must be 6 characters'),
    body('newPassword')
        .exists()
        .withMessage('newPassword is required')
        .isLength({ min: 6 })
        .withMessage('newPassword must be 6 characters'),
    body('confirmNewPassword')
        .exists()
        .withMessage('confirmNewPassword')
        .isLength({ min: 6 })
        .withMessage('confirmNewPassword must be 6 characters')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) throw new Error('confirmNewPassword not match')
            return true
        }),
    requestHandler.validate,
    userController.update_password
)

router.get('/all-user', userController.all_user)

router.get('/detail/:userId', userController.get_detail)

export default router
