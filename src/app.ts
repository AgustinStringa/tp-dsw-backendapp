import { Client } from "./Clients/Client.entity.js";
import { Trainer } from "./Trainers/Trainers.entity.js";
console.log("hello Typescipt world");

const elisito = new Client(
  "tatin01",
  "0r1",
  "elisito@outlook.com",
  "elias",
  "danteo"
);
console.log(elisito.email);
const entrenador1 = new Trainer(
  "entrenador1",
  "fitness123",
  "johntrainer@gmail.com",
  "John",
  "Johnson"
);
console.log(entrenador1.email);
