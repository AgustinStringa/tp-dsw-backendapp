import { UUID } from "node:crypto";

export default interface User {
  id: UUID;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}
