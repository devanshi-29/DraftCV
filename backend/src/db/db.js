const mongoose=require("mongoose")

async function connectDb(){
    await mongoose.connect(process.env.URI)
    console.log("Database connected Successfully")
}

module.exports=connectDb;