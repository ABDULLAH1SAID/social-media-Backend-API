import mongoose from "mongoose";

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    Database.instance = this;
  }
  
  async connect() {
    if (this.connection) {
      console.log("Already connected to DB");
      return;
    }
    try {
      this.connection = await mongoose.connect(process.env.CONNECTION_URL);
        console.log("DB connected Successfully")
      }
      catch(error){
        console.log("failed to connected DB")
      }
  }
}
export default new Database();