import { MongoClient } from "mongodb";

let db;
async function connectToDB(cb =()=>{}) {
    const url = "mongodb+srv://somepallisivanagalakshmi:hFOtase8enM3XYM9@cluster0.7eclndu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    const client = new MongoClient(url);
    await client.connect();
    db = client.db("AST_Database");
    cb();
}

connectToDB();

export { connectToDB, db };