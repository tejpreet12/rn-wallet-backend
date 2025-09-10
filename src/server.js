const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const { rateLimiter } = require("../src/middleware/rateLimiter");
const { initDB } = require("../src/config/db");
const { transactionRouter } = require("../src/routes/transactionRouter");
const job = require("../src/config/cron");
const app = express();

console.log(process.env.NODE_ENV,"process.env.NODE_ENV");
// Start the cron job
if(process.env.NODE_ENV === 'production') job.start();


//Middlewares
//Middleware for Rate Limiting
app.use(rateLimiter);
// Middleware to parse JSON bodies
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Health check endpoint
app.get('/api/healthcheck', (req, res) => {
  res.status(200).json({ 
    status: "OK",
    timestamp: new Date().toISOString()
  });
});

//Routes
app.use("/api/transactions", transactionRouter);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
