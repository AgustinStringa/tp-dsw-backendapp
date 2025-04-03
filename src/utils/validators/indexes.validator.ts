import { Client } from "../../modules/client/client/client.entity.js";
import { HttpError } from "../errors/http-error.js";
import { orm } from "../../config/db/mikro-orm.config.js";
import { Trainer } from "../../modules/trainer/trainer/trainer.entity.js";

const em = orm.em;

export async function checkUsersUniqueIndexes(
  user: Client | Trainer,
  id?: string
) {
  let aux: Client | Trainer | null;

  aux = await em.findOne(Trainer, {
    email: user.email,
  });

  if (!aux) aux = await em.findOne(Client, { email: user.email });

  if (aux && aux.id !== id)
    throw new HttpError(409, "El correo electrónico ya se encuentra en uso.");

  aux = null;
  aux = await em.findOne(Trainer, { dni: user.dni });

  if (!aux) aux = await em.findOne(Client, { dni: user.dni });

  if (aux && aux.id !== id)
    throw new HttpError(409, "Ya existe un usuario con el DNI ingresado.");
}
