import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI?.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD || "your_db_password",
  );

  try {
    const conn = await mongoose.connect(uri!);
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`❌ Connection Error: ${error.message}`);

    process.exit(1);
  }
};
