import { app, server } from "../src/app";
import { clientCookie, clientId } from "./helpers/new-client-login";
import { trainerCookie, trainerId } from "./helpers/new-trainer-login";
import { Class } from "../src/modules/class/class/class.entity";
import { ClassType } from "../src/modules/class/class-type/class-type.entity";
import { Client } from "../src/modules/client/client/client.entity";
import { Membership } from "../src/modules/membership/membership/membership.entity";
import { MembershipType } from "../src/modules/membership/membership-type/membership-type.entity";
import { orm } from "../src/config/db/mikro-orm.config";
import { Payment } from "../src/modules/membership/payment/payment.entity";
import supertest from "supertest";

const api = supertest(app);
const em = orm.em.fork();
const url = "/api/classes/registration";

describe("POST " + url, () => {
  let classCreated: Class;
  let clientToInscribe: Client;

  beforeAll(async () => {
    await em.nativeDelete(Class, { trainer: trainerId });

    const classType = em.create(ClassType, {
      name: "Clase de prueba",
      description: "Descripción",
    });

    classCreated = em.create(Class, {
      day: 1,
      startTime: "10:00",
      endTime: "11:30",
      maxCapacity: 1,
      location: "Pileta",
      active: false,
      classType,
      trainer: trainerId,
    });

    await em.flush();
  });

  it("debe devolver un error 400 si el cliente no tiene una mebresía activa", async () => {
    await em.nativeDelete(Payment, { membership: { client: clientId } });
    await em.nativeDelete(Membership, { client: clientId });

    await api
      .post(url)
      .send({
        clientId,
        classId: classCreated.id,
      })
      .set("Cookie", clientCookie)
      .expect(400);
  });

  it("debe devolver un error 404 si la clase no está activa", async () => {
    await createMembership(clientId);

    await api
      .post(url)
      .send({
        clientId,
        classId: classCreated.id,
      })
      .set("Cookie", clientCookie)
      .expect(404);
  });

  it("debe devolver un status code 201 si el cliente se inscribe a la clase", async () => {
    await em.nativeUpdate(Class, { id: classCreated.id }, { active: true });
    await api
      .post(url)
      .send({
        clientId,
        classId: classCreated.id,
      })
      .set("Cookie", clientCookie)
      .expect(201);
  });

  it("debe devolver un error 400 si el cliente ya se encuentra inscripto a la clase", async () => {
    await api
      .post(url)
      .send({
        clientId,
        classId: classCreated.id,
      })
      .set("Cookie", clientCookie)
      .expect(400);
  });

  it("debe devolver un error 409 si no hay más cupos en la clase", async () => {
    clientToInscribe = await createClient();
    await createMembership(clientToInscribe.id);

    await api
      .post(url)
      .send({
        clientId: clientToInscribe.id,
        classId: classCreated.id,
      })
      .set("Cookie", trainerCookie)
      .expect(409);
  });

  it("debe devolver un status code 201 si se modificó la capacidad máxima y el cliente pudo inscribirse a la clase", async () => {
    await em.nativeUpdate(Class, { id: classCreated.id }, { maxCapacity: 2 });

    await api
      .post(url)
      .send({
        clientId: clientToInscribe.id,
        classId: classCreated.id,
      })
      .set("Cookie", trainerCookie)
      .expect(201);
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
});

async function createClient(): Promise<Client> {
  const clientData = {
    lastName: "test",
    firstName: "client",
    dni: "40231987",
    email: "client@test.com",
    password: "my-password",
  };
  await em.nativeDelete(Client, {
    $or: [{ email: clientData.email }, { dni: clientData.dni }],
  });

  const client = em.create(Client, clientData);
  await em.flush();
  return client;
}

async function createMembership(clientId: string): Promise<void> {
  const membershipType = await em.findOneOrFail(MembershipType, {
    id: { $ne: "0" },
  });

  await api
    .post("/api/memberships")
    .send({ typeId: membershipType.id, clientId })
    .set("Cookie", trainerCookie)
    .expect(201);
}
