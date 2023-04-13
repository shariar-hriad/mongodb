import bcrypt from 'bcryptjs'

const hashPassword = async (req, res, next) => {
    try {
        const { password } = req.body

        // hash password with a salt value of 10
        const hashedPassword = await bcrypt.hash(password, 10)

        // set the hashed password on the request object for the next middleware
        req.hashedPassword = hashedPassword
        next()
    } catch {
        return false
    }
}

export default hashPassword
