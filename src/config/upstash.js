const { Redis } = require("@upstash/redis");
const { Ratelimit } = require("@upstash/ratelimit");
const dotenv = require("dotenv");
dotenv.config();

const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "60 s"), // 100 requests per minute
});

module.exports = { rateLimit };
