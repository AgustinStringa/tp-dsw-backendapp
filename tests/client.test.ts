import { app, server } from "../src/app.js";
import { Client } from "../src/modules/client/client/client.entity.js";
import { clientCookie } from "./helpers/new-client-login.js";
import { orm } from "../src/config/db/mikro-orm.config.js";
import supertest from "supertest";
import { Trainer } from "../src/modules/trainer/trainer/trainer.entity.js";
import { trainerCookie } from "./helpers/new-trainer-login.js";

const api = supertest(app);
const em = orm.em.fork();
const url = "/api/clients";

describe("GET " + url, () => {
  it("debería devolver un error 401 por no tener los permisos requeridos", async () => {
    const res = await api.get(url).set("Cookie", clientCookie);
    expect(res.status).toBe(401);
  });

  it("debería devolver un status 200", async () => {
    const res = await api.get(url).set("Cookie", trainerCookie);
    expect(res.status).toBe(200);
  });
});

describe("POST /api/clients", () => {
  const validDni = "12345678";

  const newClient: {
    lastName: string;
    firstName: string;
    dni: string | undefined;
    email: string;
    password: string | undefined;
  } = {
    lastName: "Gomez",
    firstName: "Jorge",
    dni: undefined,
    email: "jorge@gomez.com.ar",
    password: undefined,
  };

  beforeAll(async () => {
    await em.nativeDelete(Client, {
      $or: [
        {
          email: newClient.email,
        },
        { dni: validDni },
      ],
    });
    await em.nativeDelete(Trainer, {
      $or: [
        {
          email: newClient.email,
        },
        { dni: validDni },
      ],
    });
  });

  it("debería devolver un error 400 por falta de atributos", async () => {
    const res = await api
      .post(url)
      .send(newClient)
      .set("Cookie", trainerCookie);

    expect(res.statusCode).toBe(400);
  });

  it("debería devolver un error 400 por enviar un dni no válido", async () => {
    newClient.dni = "1234";
    newClient.password = "my-password";

    const res = await api
      .post(url)
      .send(newClient)
      .set("Cookie", trainerCookie);

    expect(res.statusCode).toBe(400);
  });

  it("debería devolver un statusCode 201", async () => {
    newClient.dni = validDni;

    const res = await api
      .post(url)
      .send(newClient)
      .set("Cookie", trainerCookie);

    expect(res.statusCode).toBe(201);
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
});
