const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: 'https://giving-heron-37099.upstash.io',
  token: 'AZDrAAIjcDFjNjVhYmI3MjhlMmY0YjhmYjNjZjMwOGE0NGJiMTc0MHAxMA',
})

module.exports = {redis};
// await redis.set('foo', 'bar');
// const data = await redis.get('foo');