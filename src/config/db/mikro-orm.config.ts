import { defineConfig } from "@mikro-orm/mongodb";
import { MikroORM } from "@mikro-orm/mongodb";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import { environment } from "../env.config.js";

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
