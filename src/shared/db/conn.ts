import { MongoClient, Db } from "mongodb";

const cnString =
  process.env.MONGO_URI ||
  `mongodb+srv://${encodeURIComponent("roota")}:${encodeURIComponent(
    "roota"
  )}@cluster0.asqcnur.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const cli = new MongoClient(cnString);
await cli.connect();

export let db: Db = cli.db("gimnasio");
