import { ApiError, asyncHandler, decryptToken } from '../utils/helper.utils.js';

export const isAuthenticated = (roles = []) => {
    // Allow passing a single role as a string instead of an array
    if (typeof roles === 'string') roles = [roles];

    return asyncHandler(async (req, res, next) => {
        let token = req.cookies?.auth_token;

        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            throw ApiError('Not authorized, no token provided', 401);
        }

        try {
            const decoded = decryptToken(token);
            
            // Check if user's role is allowed (if roles were specified)
            if (roles.length > 0 && !roles.includes(decoded.role)) {
                throw ApiError(`Role (${decoded.role}) is not allowed to access this resource`, 403);
            }

            req.user = decoded;
            next();
        } catch (error) {
            // Re-throw 403 errors directly, otherwise throw a 401
            if (error.statusCode === 403) throw error;
            throw ApiError('Not authorized, token failed or expired', 401);
        }
    }, 'authMiddleware');
};