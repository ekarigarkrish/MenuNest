import { asyncHandler, ApiError } from '../utils/helper.utils.js'
import userModel from '../model/user.model.js'

export default {

    getProfile: asyncHandler(async (req, res) => {
        const user = await userModel.findByPk(req.user.userId, {
            attributes: ['id', 'name', 'email', 'role', 'createdAt']
        })
        if (!user) throw ApiError('User not found', 404)

        return res.status(200).json({
            success: true,
            user: user.get({ plain: true })
        })
    }, 'getProfile'),

    updateProfile: asyncHandler(async (req, res) => {
        const { name, email, currentPassword, newPassword, confirmPassword } = req.body

        const user = await userModel.findByPk(req.user.userId)
        if (!user) throw ApiError('User not found', 404)

        // Email uniqueness check
        if (email && email !== user.email) {
            const emailTaken = await userModel.findOne({ where: { email } })
            if (emailTaken) throw ApiError('This email address is already in use', 400)
        }

        // Password change flow
        if (newPassword) {
            if (!currentPassword) throw ApiError('Current password is required to set a new password', 400)

            const isMatch = await user.comparePassword(currentPassword)
            if (!isMatch) throw ApiError('Current password is incorrect', 401)

            if (newPassword !== confirmPassword) throw ApiError('New passwords do not match', 400)
        }

        await user.update({
            name: name ?? user.name,
            email: email ?? user.email,
            ...(newPassword ? { password: newPassword } : {})
        })

        const updatedUser = user.get({ plain: true })
        delete updatedUser.password

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        })
    }, 'updateProfile')
}
