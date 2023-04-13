import mongoose from 'mongoose'
import modelOptions from './model.options.js'

const { Schema } = mongoose

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        displayName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        // salt: {
        //     type: String,
        //     required: false,
        //     select: false,
        // },
    },
    modelOptions
)

// userSchema.methods.setPassword = function (password) {
//     this.salt = crypto.randomBytes(16).toString('hex')
//     this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex')
// }

// userSchema.methods.validPassword = function (password) {
//     const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex')

//     return this.password === hash
// }

const User = mongoose.model('User', userSchema)

export default User
