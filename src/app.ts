import { Client } from "./Clients/Client.entity.js";
console.log("hello Typescipt world");

const elisito = new Client(
  "tatin01",
  "0r1",
  "elisito@outlook.com",
  "elias",
  "danteo"
);
console.log(elisito.email);
