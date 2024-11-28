import { Kafka } from 'kafkajs';
import { setCache } from './caching.js';
import dotenv from 'dotenv';

dotenv.config();

// Create a Kafka client instance
const kafka = new Kafka({
  clientId: 'cacher-consumer-client',
  brokers: [process.env.KAFKA_BROKER], // Kafka brokers
});

const consumer = kafka.consumer({ groupId: 'cacher-consumer-group' });

const consumeMessages = async () => {
    try{
        await consumer.connect(); // Connect the consumer to Kafka broker

        // Subscribe to a Kafka topic
        await consumer.subscribe({ topic: 'Top-Rated-Products-topic', fromBeginning: false });

        // Listen for new messages
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const consumedMessage = message.value.toString();
                console.log(typeof(consumedMessage))
                console.log(`Consumed message from Kafka: ${consumedMessage}`);
        
                // After consuming, send the message to Redis
                await setCache(consumedMessage);
            },
        });
    } catch (error) {
        console.error('Error in cacher-consumer-group:', error);
    }
};

export {consumeMessages};
