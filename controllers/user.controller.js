import bcrypt from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'
import mongoose from 'mongoose'
import responseHandler from '../handlers/response.handler.js'
import User from '../models/user.model.js'

// module scafolding
const userController = {}

userController.sign_up = async (req, res) => {
    try {
        const { username, displayName } = req.body
        const hashedPassword = req.hashedPassword

        const existedUser = await User.findOne({ username })

        if (existedUser) return responseHandler.badrequest(res, 'Username already used!')

        const user = await User.create({
            username,
            displayName,
            password: hashedPassword,
        })

        const token = jsonwebtoken.sign({ data: user.id }, process.env.TOKEN_SECRET, { expiresIn: '24h' })

        responseHandler.created(res, {
            token,
            ...user._doc,
            id: user.id,
        })
    } catch {
        responseHandler.error(res)
    }
}

userController.sign_in = async (req, res) => {
    try {
        const { username, password } = req.body

        const user = await User.findOne({ username }).select('username password')
        if (!user) return responseHandler.badrequest(res, 'User not exist')

        const isPasswordCorrect = bcrypt.compareSync(password, user.password)
        if (!isPasswordCorrect) return responseHandler.badrequest(res, 'Wrong password')

        const token = jsonwebtoken.sign({ data: user.id }, process.env.TOKEN_SECRET, { expiresIn: '24h' })

        user.password = undefined

        responseHandler.created(res, {
            token,
            ...user._doc,
        })
    } catch {
        responseHandler.error(res)
    }
}

userController.all_user = async (req, res) => {
    try {
        const users = await User.find({})
        responseHandler.ok(res, users)
    } catch {
        responseHandler.error(res)
    }
}

userController.get_detail = async (req, res) => {
    try {
        const { userId } = req.params

        const isValid = mongoose.Types.ObjectId.isValid(userId)
        if (!isValid) return responseHandler.badrequest(res, 'Invalid user id')

        const user = await User.findById({ _id: userId })

        responseHandler.ok(res, user)
    } catch {
        responseHandler.error(res)
    }
}

userController.update_profile = async (req, res) => {
    try {
        const { userId } = req.params
        // const { username, displayName, password, newPassword } = req.body

        const isValid = mongoose.Types.ObjectId.isValid(userId)
        if (!isValid) return responseHandler.badrequest(res, 'Invalid user id')

        const checkUser = await User.findById({ _id: userId })
        if (!checkUser) return responseHandler.unauthorize(res)

        // if (!checkUser.validPassword(password)) return responseHandler.badrequest(res, 'Wrong password')

        // const updated_profile = await User.findByIdAndUpdate(
        //     { _id: userId },
        //     {
        //         username,
        //         displayName,
        //         password: newPassword,
        //     }
        // )

        responseHandler.ok(res, checkUser)
    } catch {
        responseHandler.error(res)
    }
}

userController.update_password = async (req, res) => {
    try {
        const { userId } = req.params
        const { password, newPassword } = req.body

        const user = await User.findById({ _id: userId }).select('password id salt')

        if (!user) return responseHandler.unauthorize(res)

        if (!user.validPassword(password)) return responseHandler.badrequest(res, 'Wrong password')

        user.setPassword(newPassword)

        await user.save()

        responseHandler.ok(res)
    } catch {
        responseHandler.error(res)
    }
}

export default userController
