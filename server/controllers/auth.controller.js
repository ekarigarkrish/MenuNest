import { asyncHandler } from "../utils/helper.utils.js";
import { generateToken } from "../services/csrf.service.js";
import config from "../config/config.js";

export default {
    generateCSRFToken: asyncHandler(async (req, res) => {
        const token = generateToken(req, res); // Sets 'x-csrf-token' hash cookie

        // Set a separate non-HttpOnly cookie for Axios to automatically read
        res.cookie('csrf-token', token, {
            httpOnly: false,
            secure: !config.isDEV,
            sameSite: config.isDEV ? 'lax' : 'none',
        });

        return res.status(200).json({ success: true, message: "CSRF cookies set successfully" });
    }, 'generateCSRFToken')
}