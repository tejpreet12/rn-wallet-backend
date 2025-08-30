const dotenv = require("dotenv");
dotenv.config();
const { neon } = require("@neondatabase/serverless");

//Creates Sql connection using our DB URL from .env file
const sql = neon(process.env.DATABASE_URL);

async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions (
                id SERIAL PRIMARY KEY,  
                user_id VARCHAR(255) NOT NULL,
                title VARCHAR(255) NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                category VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`;

    /**
     *  Decimal(10, 2)
     *  means the number can be up to
     *  10 digits long, with 2 digits after the decimal point.
     *  This allows for values ranging from -99999999.99 to 99999999.99.
     */
    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1); //Status code 1 indicates failure and 0 indicates success
  }
}


module.exports = { sql, initDB };

