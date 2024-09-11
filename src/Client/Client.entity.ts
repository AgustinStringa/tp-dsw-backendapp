import User from "../shared/interfaces/user.interface.js";
import { Entity, Property, OneToMany, Collection } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Progress } from "./Progress.entity.js";
import { Goal } from "./Goal.entity.js";
import { CurrentMembership } from "../Membership/CurrentMembership.entity.js";
import { Routine } from "../Routine/Routine.entity.js";
import { Registration } from "../Class/Registration.entity.js";

@Entity()
export class Client extends BaseEntity implements User {
  @Property({ nullable: false })
  lastName!: string;

  @Property({ nullable: false })
  firstName!: string;

  @Property({ nullable: false })
  dni!: string;

  @Property({ nullable: false })
  email!: string;

  @Property({ nullable: false })
  password!: string;

  @OneToMany({
    entity: () => Progress,
    mappedBy: "client",
    orphanRemoval: true,
  })
  progresses = new Collection<Progress>(this);

  @OneToMany({
    entity: () => Goal,
    mappedBy: "client",
    orphanRemoval: true,
  })
  goals = new Collection<Goal>(this);

  @OneToMany({
    entity: () => CurrentMembership,
    mappedBy: "client",
    orphanRemoval: true,
  })
  memberships = new Collection<CurrentMembership>(this);
  @OneToMany({
    entity: () => Routine,
    mappedBy: "client",
    orphanRemoval: true,
  })
  routines = new Collection<Routine>(this);

  @OneToMany({
    entity: () => Registration,
    mappedBy: "client",
    orphanRemoval: true,
  })
  registrations = new Collection<Registration>(this);

  getLastRoutine() {
    if (this.routines.length > 0) {
      const arrayRoutines = Array.from(this.routines).sort((a, b) => {
        if (a.end > b.end) {
          return 1;
        }
        if (a.end < b.end) {
          return -1;
        }
        return 0;
      });
      return arrayRoutines[0];
    } else {
      return null;
    }
  }

  getCurrentMembership() {
    if (this.memberships.length > 0) {
      const arrayMemberships = Array.from(this.memberships).sort((a, b) => {
        if (a.dateTo != null && b.dateTo != null) {
          if (a.dateTo > b.dateTo) {
            return 1;
          }
          if (a.dateTo < b.dateTo) {
            return -1;
          }
          return 0;
        } else {
          return 0;
        }
      });
      return arrayMemberships[0];
    } else {
      return null;
    }
  }
}
