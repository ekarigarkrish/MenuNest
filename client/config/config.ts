import dotenv from 'dotenv'

dotenv.config({
    quiet: true,
    path: `.env.${process.env.NEXT_PUBLIC_NODE_ENV}`
})

export default {
    node_env: process.env.NEXT_PUBLIC_NODE_ENV,
    isDEV: process.env.NEXT_PUBLIC_NODE_ENV === 'dev',
    serverOrigin: process.env.NEXT_PUBLIC_SERVER_ORIGIN,
    clientOrigin: process.env.NEXT_PUBLIC_CLIENT_ORIGIN,
}