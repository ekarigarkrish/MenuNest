import { doubleCsrf } from "csrf-csrf"
import config from "../config/config.js"

const { generateCsrfToken: generateToken, doubleCsrfProtection } = doubleCsrf({

    getSecret: () => config.csrfSecretKey,
    getSessionIdentifier: () => 'anonymous',
    cookieName: "csrf-token",
    cookieOptions: {
        httpOnly: true, // MUST be true for security (protects the hash)
        sameSite: config.isDEV ? "lax" : "none",
        secure: !config.isDEV,
        domain: config.isDEV ? undefined : `.${config.clientOrigin.split('//')[1]}`,
        path: "/"
    },

    size: 64,

    ignoredMethods: [
        "GET",
        "HEAD",
        "OPTIONS"
    ]

})

export { generateToken, doubleCsrfProtection }