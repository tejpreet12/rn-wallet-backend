const express = require("express");
const router = express.Router();
const {
  getTransactionsByUserId,
  getTransactionSummaryByUserId,
  createTransaction,
  deleteTransactionById,
} = require("../controllers/transactionController");

router.get("/:userId", getTransactionsByUserId);
router.post("/", createTransaction);
router.delete("/:id", deleteTransactionById);
router.get("/summary/:userId", getTransactionSummaryByUserId);

module.exports = { transactionRouter: router };
