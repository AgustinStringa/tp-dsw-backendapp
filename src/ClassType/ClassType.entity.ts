import crypto from "node:crypto";

export class ClassType {
  constructor(
    public name: string, // pílates, zumba, pileta (si es que lo manejamos por turnos)
    public description: string,
    public id = crypto.randomUUID()
  ) {}
}
