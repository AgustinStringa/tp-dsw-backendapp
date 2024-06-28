import { MikroORM } from "@mikro-orm/core";
import { MongoDriver } from "@mikro-orm/mongodb";

export const orm = await MikroORM.init({
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  dbName: "gimnasio",
  clientUrl: `mongodb+srv://${encodeURIComponent("roota")}:${encodeURIComponent(
    "roota"
  )}@cluster0.asqcnur.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,

  // clientUrl: "mongodb://localhost:27017/gimnasio", //la conexión a Atlas no está funcionando
  driver: MongoDriver,
  debug: true,
});
