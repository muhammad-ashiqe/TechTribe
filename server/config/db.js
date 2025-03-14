import mongoose from "mongoose"

const ConnectDB = async()=>{
  try {
     const dbConnection = await mongoose.connect(process.env.MONGO_URI).then(()=>{console.log("db connected")})
  } catch (error) {
    console.log("error connecting db")
  }
 
}

export default ConnectDB