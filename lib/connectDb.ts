import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDb = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    const mongodbUrl = process.env.MONGODB_URI;

    if (!mongodbUrl) {
        throw new Error("MONGODB_URI is not defined in environment variables");
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(mongodbUrl).then((conn) => {
            return conn.connection;
        });
    }

    try {
        const conn = await cached.promise;
        cached.conn = conn;
        return conn;
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        cached.promise = null;
        throw err;
    }
};

export default connectDb;