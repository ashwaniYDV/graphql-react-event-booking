const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../../models/user')
const { JWT_SECRET } = require('../../configs/config')


module.exports = {
    createUser: async (args) => {
        const { userInput: { email, password, name }} = args

        try {
            const check = await User.findOne({ email })
            if (check) {
                throw new Error('User already registered with this email')
            }
            const hashedPassword = await bcrypt.hash(password, 12)
            let user = new User({
                email,
                password: hashedPassword,
                name
            })
            user = await user.save()
            return { ...user._doc }
        } catch(err) {
            throw err;
        }
    },

    login: async ({ email, password }) => {
        try {
            const user = await User.findOne({ email })
            if (!user) {
                throw new Error('Email is incorrect or user does not exist!')
            }
            const passwordValid = await bcrypt.compare(password, user.password)
            if (!passwordValid) {
                throw new Error('Password is incorrect!')
            }

            const token = jwt.sign({
                userId: user.id,
                email: user.email
            }, JWT_SECRET, {
                expiresIn: '1h'
            })

            return { userId: user.id, token, tokenExpiration: 1, user }
        } catch(err) {
            throw err;
        }
    },
}