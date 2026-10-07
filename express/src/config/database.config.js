import { Sequelize } from "sequelize"
import dotenv from "dotenv"
dotenv.config();
const dbname = process.env.DB_NAME || "projetsportl3"
const dbuser = process.env.DB_USERNAME || "root"
const dbpassword = process.env.DB_PASSWORD || ""
const dbhost = process.env.DB_HOST || "localhost"
const dbdialect = process.env.DB_DIALECT || "mysql"

const sequelize = new Sequelize(dbname, dbuser,dbpassword,{
    host:dbhost,
    dialect:dbdialect
})

export default sequelize;