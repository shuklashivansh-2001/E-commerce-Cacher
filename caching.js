// redisCache.js
import  { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();
// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL, // Redis connection URL
});

// Connect to Redis
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Error connecting to Redis:', err);
    process.exit(1); // Exit the process if Redis fails to connect
  }
};

// Set cache with expiration time (in seconds)
const setCache = async (value) => {
  try {
    const pvalue = JSON.parse(value);
    const product = JSON.parse(pvalue);
    console.log(product);
    console.log(typeof product);
    console.log(product?._id);

    const key = `topRatedProducts:${product?._id}`;
    if(key != undefined){
      await redisClient.set(key,pvalue);
      console.log(`Cache set for key: ${key}`);
    }else{
      console.log(`Key is undefined`);
    }
  } catch (err) {
    console.error('Error setting cache:', err);
  }
};


// Export the functions and client for use in other modules
export { connectRedis, setCache };
