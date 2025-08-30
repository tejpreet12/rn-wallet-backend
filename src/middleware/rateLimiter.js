const { rateLimit } = require("../config/upstash");

const rateLimiter = async (req, res, next) => {
  try {
    //here we have added limit to my-rate-limit key which is same for all users for simplicity
    //In production you can use user identifier like userId or IP address to have separate limits for each user
    const { success } = await rateLimit.limit("my-rate-limit");

    if (!success) {
      return res
        .status(429)
        .json({ error: "Too many requests. Please try again later." });
    }

    next();
  } catch (error) {
    console.log("Rate limit error", error);
    next(error);
  }
};

module.exports = { rateLimiter };
