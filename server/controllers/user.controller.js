import { ApiError, asyncHandler, signToken } from '../utils/helper.utils.js'
import { userModel, tableModel } from '../model/assoication.js'
import config from '../config/config.js'
import bcrypt from 'bcryptjs';

export default {
  handleLogin: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) throw ApiError("Please provide email and password", 400);

    const user = await userModel.findOne({ where: { email } })
    if (!user) throw ApiError('Invalid Email & Password!', 404)

    const isPasswordMatch = await user.comparePassword(password)
    if (!isPasswordMatch) throw ApiError("Invalid Email & Password!", 401)

    const token = signToken({ userId: user.id, role: user.role })

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: !config.isDEV,
      sameSite: config.isDEV ? 'lax' : 'none',
      domain: config.isDEV ? undefined : `.${config.clientOrigin.split('//')[1]}`,
      path: "/"
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

    res.clearCookie("csrf-token", {
      httpOnly: true,
      secure: !config.isDEV,
      sameSite: config.isDEV ? 'lax' : 'none',
      domain: config.isDEV ? undefined : `.${config.clientOrigin.split('//')[1]}`,
      path: "/"
    })

    return res.status(200).json({
      success: true,
      message: "Logout success"
    })
  }, 'handleLogout'),

  createUserRole: asyncHandler(async (req, res) => {
    const { name, phone, role, tables } = req.body;
    if (!name || !phone || !role) throw ApiError("Please provide name, phone and role", 400);

    const user = await userModel.create({
      name, phone, role,
      password: await bcrypt.hash(phone, 10)
    })

    if (!user) throw ApiError("Failed to create user", 400)

    // Bulk-assign selected tables to this user
    if (Array.isArray(tables) && tables.length > 0) {
      await tableModel.update(
        { userId: user.id },
        { where: { id: tables } }
      )
    }

    return res.status(200).json({
      success: true,
      message: "User created successfully"
    })
  }, 'createUserRole'),

  getRoles: asyncHandler(async (req, res) => {
    let { page, limit } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;
    let where = { role: 'staff' };

    const { rows, count } = await userModel.findAndCountAll({
      include: [
        {
          model: tableModel,
          as: 'tables',
          attributes: ['id', 'name']
        }
      ],
      where,
      limit,
      offset
    })

    return res.status(200).json({
      success: true,
      message: "Roles fetched successfully",
      data: rows,
      pagination: {
        page,
        limit,
        total: count
      }
    })
  }, 'getRoles'),

  updateUserRole: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, phone, role, tables } = req.body;

    if (!id) throw ApiError("Something went wrong!", 400);

    await userModel.update({ name, phone, role }, { where: { id } })

    // Reassign tables: clear old assignments then bulk-set new ones
    await tableModel.update({ userId: null }, { where: { userId: id } })
    if (Array.isArray(tables) && tables.length > 0) {
      await tableModel.update(
        { userId: id },
        { where: { id: tables } }
      )
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully"
    })
  }, 'updateUserRole'),

  deleteUserRole: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw ApiError("Something went wrong!", 400);

    const user = await userModel.destroy({ where: { id } })
    if (!user) throw ApiError("Failed to delete user", 400)

    return res.status(200).json({
      success: true,
      message: "User deleted successfully"
    })
  }, 'deleteUserRole')
}