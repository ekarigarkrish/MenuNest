import { doubleCsrf } from "csrf-csrf"
import config from "../config/config.js"

const { generateToken, doubleCsrfProtection } = doubleCsrf({

    getSecret: () => config.csrfSecretKey,
    cookieName: "x-csrf-token",
    cookieOptions: {
        httpOnly: true, // MUST be true for security (protects the hash)
        sameSite: config.isDEV ? "none" : "lax",
        secure: !config.isDEV
    },

    size: 64,

    ignoredMethods: [
        "GET",
        "HEAD",
        "OPTIONS"
    ]

})

export { generateToken, doubleCsrfProtection }