import rateLimit from 'express-rate-limit';

// Rate limiter for requesting OTPs
export const otpRequestLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // Limit each IP to 3 OTP requests per 5 minutes
    message: {
        success: false,
        message: 'Too many OTP requests, please try again after 5 minutes'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Rate limiter for verifying OTPs (prevents brute force guessing)
export const otpVerifyLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, // Limit each IP to 5 OTP verification attempts per 5 minutes
    message: {
        success: false,
        message: 'Too many failed verification attempts, please try again after 5 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});