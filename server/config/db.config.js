import { Sequelize } from "sequelize"
import config from './config.js'

export const sequelize = new Sequelize(
    config.db_name,          // DB name
    config.db_user,         // User
    config.db_pass,      // Password
    {
        host: config.db_host,
        dialect: 'mysql',
        logging: false,
        port: config.db_port,
    }
)

export default sequelize