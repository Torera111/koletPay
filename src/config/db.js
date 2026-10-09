import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from the project .env file regardless of where the app is launched from
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const connectDB = async () => {
    try{
        const dbURI = process.env.MONGO_URI;
        if (!dbURI){
            throw new Error('MONGO_URI is not defined in the environment variables');
        }
        const conn = await mongoose.connect(dbURI, {
            serverSelectionTimeoutMS: 5000, //Timeout after 5 seconds instead of hanging during hackathon demo
        });
        console.log(`Cloud MongoDB Atlas Connected: ${conn.connection.host}`)
    } catch (error){
        console.error(`Atlas connection Failed : ${error.message}`);
        process.exit(1); //Exit process with failure
    }
}
export default connectDB;