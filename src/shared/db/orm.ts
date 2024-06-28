import { MikroORM } from "@mikro-orm/core";
import { defineConfig, MongoDriver } from "@mikro-orm/mongodb";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
const config = defineConfig({
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  dbName: "example-mikro",
  highlighter: new MongoHighlighter(),
  debug: true,
  driver: MongoDriver,
  clientUrl: `mongodb+srv://${encodeURIComponent("roota")}:${encodeURIComponent(
    "roota"
  )}@cluster0.asqcnur.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
});

export const orm = await MikroORM.init(config);
