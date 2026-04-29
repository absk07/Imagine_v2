import mongoose, { Connection } from 'mongoose';

const dbUrl: string = process.env.DB_URL || 'mongodb://localhost:27017/tti';

const connectToDatabase = async (): Promise<Connection> => {
    try {
        await mongoose.connect(dbUrl);

        const db: Connection = mongoose.connection;

        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', () => {
            console.log('Database connected');
        });

        return db;
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        throw error;
    }
};

export default connectToDatabase;