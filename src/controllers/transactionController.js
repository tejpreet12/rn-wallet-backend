const { sql } = require("../config/db");

async function getTransactionsByUserId(req, res) {
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
}

async function getTransactionSummaryByUserId(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "Missing UserId" });
    }

    // const balance = await sql`
    //   SELECT COALESCE(SUM(amount), 0) AS balance from transactions WHERE user_id = ${userId}`;

    // const income =
    //   await sql`SELECT COALESCE(SUM(amount), 0) AS income from transactions
    //  WHERE user_id = ${userId} AND amount > 0`;

    // const expense =
    //   await sql`SELECT COALESCE(SUM(amount), 0) AS expense from transactions
    //                 WHERE user_id =${userId} AND amount < 0`;

    /**
     * Optimized Query by GitHub Copilot
     * This single query replaces three separate database calls for better performance:
     * 1. Reduces database round trips from 3 to 1
     * 2. Scans the transactions table only once instead of three times
     * 3. Calculates balance, income, and expenses in a single pass
     *
     * CASE statements are used to conditionally sum amounts:
     * - balance: sum of all amounts
     * - income: sum of positive amounts only
     * - expense: sum of negative amounts only
     *
     * COALESCE ensures we get 0 instead of NULL when no records are found
     */
    const summary = await sql`
      SELECT 
        COALESCE(SUM(amount), 0) as balance,
        COALESCE(SUM(CASE WHEN amount > 0 THEN amount END), 0) as income,
        COALESCE(SUM(CASE WHEN amount < 0 THEN amount END), 0) as expense
      FROM transactions 
      WHERE user_id = ${userId}
    `;

    res.status(200).json({
      message: "Transaction summary fetched successfully",
      balance: summary[0].balance,
      income: summary[0].income,
      expense: summary[0].expense,
    });
  } catch (error) {
    console.error("Error fetching transaction summary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function createTransaction(req, res) {
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
}

async function deleteTransactionById(req, res) {
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

    res.status(200).json({
      message: "Transaction deleted successfully",
      transaction: result[0],
    });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getTransactionsByUserId,
  getTransactionSummaryByUserId,
  createTransaction,
  deleteTransactionById
};
