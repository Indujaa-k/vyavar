import mongoose from "mongoose";
import dotenv from "dotenv";
import chalk from "chalk";
import dns from "dns";  

dotenv.config();
// import colors from "colors";

// Manually set DNS servers
dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

// a mongoose stuf (mongoose.connect ....) return always a promise
const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    // console.log(
    //   "MONGO_URI:",
    //   process.env.MONGO_URI
    // ); // Debugging line
    
    
    const conn = await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");
    console.log(chalk.yellow(`Database Name: ${conn.connection.name}`));
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
export default connectDB;
