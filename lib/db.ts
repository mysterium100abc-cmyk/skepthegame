import mongoose from "mongoose";

const MONGO_URI = `${process.env.MONGO_DB_URL}/${process.env.DB_NAME} `;

export const connectDB = async (options = {}) => {
  try {
    const connectionInstance = await mongoose.connect(MONGO_URI, options);
    console.log("==== DB Connected ===");
    console.log(`DB_HOST: ${connectionInstance.connection.host}`);

    mongoose.connection.on("error", (error) => {
      console.log("==== DB Connection Lost ====");
      console.log(error.toString());
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("==== DB Connection Failed ====", error.message);
    } else {
      console.log("==== DB Connection Failed ====", String(error));
    }
  }
};
