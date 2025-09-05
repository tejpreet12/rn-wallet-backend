const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const { rateLimiter } = require("../src/middleware/rateLimiter");
const { initDB } = require("../src/config/db");
const { transactionRouter } = require("../src/routes/transactionRouter");

const app = express();

//Middlewares
//Middleware for Rate Limiting
app.use(rateLimiter);
// Middleware to parse JSON bodies
app.use(express.json());

const PORT = process.env.PORT || 5001;

//Routes
app.use("/api/transactions", transactionRouter);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
