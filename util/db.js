const mongoose=require('mongoose');
const uri = "mongodb+srv://akashcse201620:aTMJIUCLDCqRU8Qt@cluster0.zmchud9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const connectDb = async()=>{
    try{
    const conn= await mongoose.connect(uri);

    console.log(`mongodb connected ${conn.connection.host}`)
    }catch(err){
        throw err;
    }
}

module.exports=connectDb;


// const { MongoClient, ServerApiVersion } = require('mongodb');
// let _db;

// const mongoConnect =callback =>{
//     MongoClient.connect(uri)
//     .then((client)=>{
//         console.log("Connected to MongoDB");
//         _db=client.db()
//        // callback();
//     })
//     .catch((err)=>{
//         console.log(err);
//         throw err;
//     })
// } ;

// const getDb= ()=>{
//     if(_db){
//         console.log("test db is connect");
//     }
//     throw "no database found!"
// }

// exports.mongoConnect=mongoConnect;
// exports.getDb=getDb;


