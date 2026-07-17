import { ApiError, asyncHandler } from '../utils/helper.utils.js'
import userModel from '../model/user.model.js'
import config from '../config/config.js'

export default {

  handleLogin: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) throw ApiError("Please provide email and password", 400);

    const user = await userModel.findOne({ where: { email } })
    if (!user) throw ApiError('Invalid Email & Password!', 404)

    const isPasswordMatch = await user.comparePassword(password)
    if (!isPasswordMatch) throw ApiError("Invalid Email & Password!", 401)

    res.cookie("auth_token", '', {
      httpOnly: true,
      secure: !config.isDEV,
      sameSite: config.isDEV ? 'lax' : 'none',
    })

    return res.status(200).json({
      success: true,
      message: "Login success",
      role: user.role
    })
  }, 'handleLogin'),

  handleLogout: asyncHandler(async (req, res) => {
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: !config.isDEV,
      sameSite: config.isDEV ? 'lax' : 'none',
    })

    return res.status(200).json({
      success: true,
      message: "Logout success"
    })
  }, 'handleLogout')
}
