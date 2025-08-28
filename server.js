const dotenv = require("dotenv");
dotenv.config();
const express = require("express");

const { sql } = require("./config/db");

const app = express();
// Middleware to parse JSON bodies
app.use(express.json());

const PORT = process.env.PORT || 5001;

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

app.get("/api/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "Missing UserId" });
    }

    const transaction =
      await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;

    if (transaction.length === 0) {
      return res.status(404).json({ error: "No transactions found" });
    }

    res
      .status(200)
      .json({ message: "Transactions fetched successfully", transaction });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/transactions", async (req, res) => {
  try {
    const { user_id, title, category, amount } = req.body;

    if (!user_id || !title || !category || amount === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const transaction =
      await sql`INSERT INTO transactions (user_id,title,category,amount)
                VALUES (${user_id},${title},${category},${amount}) 
                RETURNING *`;

    res.status(201).json(transaction[0]);
  } catch (err) {
    console.error("Error creating transaction:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ error: "Invalid transaction ID" });
    }

    if (!id) {
      return res.status(400).json({ error: "Missing transaction ID" });
    }

    const result =
      await sql`DELETE FROM transactions WHERE id =${id} RETURNING *`;

    if (result.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res
      .status(200)
      .json({
        message: "Transaction deleted successfully",
        transaction: result[0],
      });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
