import { app, server } from "../src/app";
import { Client } from "../src/modules/client/client/client.entity";
import { orm } from "../src/config/db/mikro-orm.config";
import supertest from "supertest";
import { Trainer } from "../src/modules/trainer/trainer/trainer.entity";

const api = supertest(app);
const em = orm.em.fork();
const url = "/api/auth";

describe("POST " + url, () => {
  const newClient = {
    lastName: "apellido",
    firstName: "nombre",
    dni: "44555666",
    email: "usuario@test.com",
    password: "my-password",
  };

  const wrongPassword = "wrong";

  beforeAll(async () => {
    await em.nativeDelete(Client, {
      $or: [{ email: newClient.email }, { dni: newClient.dni }],
    });
    await em.nativeDelete(Trainer, {
      $or: [{ email: newClient.email }, { dni: newClient.dni }],
    });
  });

  it("debe devolver un error 401 cuando el usuario no existe", async () => {
    const usuario = {
      email: newClient.email,
      password: newClient.password,
    };
    await api.post(url).send(usuario).expect(401);
  });

  it("debe devolver un error 401 cuando la contraseña es incorrecta", async () => {
    await api.post("/api/clients").send(newClient).expect(201);

    const usuario = {
      email: newClient.email,
      password: wrongPassword,
    };
    await api.post(url).send(usuario).expect(401);
  });

  it("debe devolver un statusCode 200 cuando el usuario inicia sesión", async () => {
    const usuario = {
      email: newClient.email,
      password: newClient.password,
    };
    await api.post(url).send(usuario).expect(200);
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
});
