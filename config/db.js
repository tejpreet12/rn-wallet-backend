const dotenv = require("dotenv");
dotenv.config();
const { neon } = require("@neondatabase/serverless");

//Creates Sql connection using our DB URL from .env file
const sql = neon(process.env.DATABASE_URL);

module.exports = { sql };
