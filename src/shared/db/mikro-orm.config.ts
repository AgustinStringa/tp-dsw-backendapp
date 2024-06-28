import { MikroORM } from "@mikro-orm/mongodb";
import { defineConfig } from "@mikro-orm/mongodb";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
const config = defineConfig({
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  dbName: "gimnasio",
  highlighter: new MongoHighlighter(),
  debug: true,
  clientUrl: `mongodb+srv://${encodeURIComponent("roota")}:${encodeURIComponent(
    "roota"
  )}@cluster0.asqcnur.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
});

export const orm = await MikroORM.init(config);
