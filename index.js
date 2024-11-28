import express from 'express';
import {consumeMessages} from './consumer.js';
import { connectRedis } from './caching.js';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON
const app = express();
app.use(express.json());

const init = async () => {
    await connectRedis(); // Connect to Redis
    await consumeMessages(); // Start consuming Kafka messages
};
  
init();

// Basic health route
app.get('/health', (req, res) => {
    res.send(`Cacher server is healthy, running on ${PORT} and fully functional`);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Cacher Server is running on http://localhost:${PORT}`);
});
