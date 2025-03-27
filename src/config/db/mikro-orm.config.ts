import { defineConfig } from "@mikro-orm/mongodb";
import { environment } from "../env.config.js";
import { MikroORM } from "@mikro-orm/mongodb";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";

const config = defineConfig({
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  dbName: "gimnasio",
  highlighter: new MongoHighlighter(),
  debug: !environment.production,
  clientUrl: environment.mongoUri,
  ensureIndexes: true,
});

export const orm = await MikroORM.init(config);
