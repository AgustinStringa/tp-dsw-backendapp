import { Entity, Property, OneToMany, Collection } from "@mikro-orm/core";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { BaseEntity } from "../../../config/db/base-entity.entity.js";
import { Goal } from "../goal/goal.entity.js";
import { IUser } from "../../../utils/interfaces/user.interface";
import { Membership } from "../../membership/membership/membership.entity.js";
import { Progress } from "../progress/progress.entity.js";
import { Registration } from "../../class/registration/registration.entity.js";
import { Routine } from "../../routine/routine/routine.entity.js";

@Entity()
export class Client extends BaseEntity implements IUser {
  @IsNotEmpty()
  @Property({ nullable: false })
  lastName!: string;

  @IsNotEmpty()
  @Property({ nullable: false })
  firstName!: string;

  @IsNotEmpty()
  @MinLength(7)
  @MaxLength(8)
  @Property({ nullable: false, unique: true })
  dni!: string;

  @IsNotEmpty()
  @Property({ nullable: false, unique: true })
  email!: string;

  @IsNotEmpty()
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
    entity: () => Membership,
    mappedBy: "client",
    orphanRemoval: true,
  })
  memberships = new Collection<Membership>(this);
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
}
