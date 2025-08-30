const { Redis } = require("@upstash/redis");
const { Ratelimit } = require("@upstash/ratelimit");
const dotenv = require("dotenv");
dotenv.config();

const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "60 s"), // 10 requests per minute
});

module.exports = { rateLimit };
