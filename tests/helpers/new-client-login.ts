import { app } from "../../src/app";
import { Client } from "../../src/modules/client/client/client.entity";
import { orm } from "../../src/config/db/mikro-orm.config";
import supertest from "supertest";
import { Trainer } from "../../src/modules/trainer/trainer/trainer.entity";

export let clientCookie: string;
export let clientId: string;

const api = supertest(app);
const em = orm.em;

const newClient = {
  lastName: "test",
  firstName: "client",
  dni: "40231987",
  email: "client@test.com",
  password: "my-password",
};

beforeAll(async () => {
  await em.nativeDelete(Client, {
    $or: [{ email: newClient.email }, { dni: newClient.dni }],
  });
  await em.nativeDelete(Trainer, {
    $or: [{ email: newClient.email }, { dni: newClient.dni }],
  });

  await api.post("/api/clients").send(newClient).expect(201);

  const response = await api.post("/api/auth").send({
    email: newClient.email,
    password: newClient.password,
  });

  const cookieHeader = Array.isArray(response.headers["set-cookie"])
    ? response.headers["set-cookie"]
    : [response.headers["set-cookie"]];

  clientCookie = cookieHeader.find((c) => c.startsWith("auth_token="));
  clientId = response.body.data.user.id;
});
