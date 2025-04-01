import { app } from "../../src/app";
import bcrypt from "bcrypt";
import { Client } from "../../src/modules/client/client/client.entity";
import { orm } from "../../src/config/db/mikro-orm.config";
import supertest from "supertest";
import { Trainer } from "../../src/modules/trainer/trainer/trainer.entity";

export let trainerCookie: string;
export let trainerId: string;

const api = supertest(app);
const em = orm.em.fork();

const newTrainer = {
  lastName: "test",
  firstName: "trainer",
  dni: "27272727",
  email: "trainer@test.com",
  password: bcrypt.hashSync("my-password", 10),
};

beforeAll(async () => {
  await em.nativeDelete(Client, {
    $or: [{ email: newTrainer.email }, { dni: newTrainer.dni }],
  });
  await em.nativeDelete(Trainer, {
    $or: [{ email: newTrainer.email }, { dni: newTrainer.dni }],
  });

  em.create(Trainer, newTrainer);
  await em.flush();

  const response = await api.post("/api/auth").send({
    email: newTrainer.email,
    password: "my-password", //la del objeto está encriptada
  });

  const cookieHeader = Array.isArray(response.headers["set-cookie"])
    ? response.headers["set-cookie"]
    : [response.headers["set-cookie"]];

  trainerCookie = cookieHeader.find((c) => c.startsWith("auth_token="));
  trainerId = response.body.data.user.id;
});
