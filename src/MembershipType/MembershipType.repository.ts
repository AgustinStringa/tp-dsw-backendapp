import { Repository } from "../shared/repository.js";
import { MembershipType } from "./MembershipType.entity.js";

const membershipTypesList = [
  new MembershipType(
    "Only GYM",
    "Membresia que incluye solo gym",
    1000,
    new Date()
  ),
  new MembershipType(
    "Only Clases",
    "Membresia que incluye solo clases",
    500,
    new Date()
  ),
  new MembershipType("Unified Couta", "Incluye Todo", 1500, new Date()),
  new MembershipType(
    "Only Pool",
    "Membresia que incluye solo pileta",
    500,
    new Date()
  ),
  new MembershipType(
    "GYM and Pool",
    "Membreia que incluye pileta y gimnasio",
    800,
    new Date()
  ),
  new MembershipType(
    "Pool and Clases",
    "Membresia que incluye pileta y clases",
    800,
    new Date()
  ),
  new MembershipType("Null", "No posee ninguna membresia", 0, new Date()),
];

export class MembershipTypeRepository implements Repository<MembershipType> {
  public async findAll(): Promise<MembershipType[] | undefined> {
    return membershipTypesList;
    //   return await characters.find({}).toArray();
  }
  public async findOne(item: {
    id: string;
  }): Promise<MembershipType | undefined> {
    //return (
    //  (await characters.findOne({ _id: new ObjectId(item.id) })) || undefined
    //);
    const membershiptype = membershipTypesList.find((m) => m.id === item.id);
    return membershiptype;
  }
  public async add(item: MembershipType): Promise<MembershipType | undefined> {
    //asumimos que el item es una entrada ya sanitizada.
    //la tarea de sanitizacion no corresponde a esta capa
    // item._id = (await characters.insertOne(item)).insertedId;
    //return item || undefined;
    membershipTypesList.push(item);
    return item;
  }
  public async update(
    item: MembershipType
  ): Promise<MembershipType | undefined> {
    // const { id, ...characterInput } = item;
    // return (
    //   (await characters.findOneAndUpdate(
    //     { _id: new ObjectId(item.id) },
    //     {
    //       $set: {
    //         ...characterInput,
    //       },
    //     },
    //     { returnDocument: "after" }
    //   )) || undefined
    // );
    const MembershipTypeIdx = membershipTypesList.findIndex(
      (m) => m.id === item.id
    );
    if (MembershipTypeIdx !== -1) {
      membershipTypesList[MembershipTypeIdx] = {
        ...membershipTypesList[MembershipTypeIdx],
        ...item,
      };
      return membershipTypesList[MembershipTypeIdx];
    } else {
      return undefined;
    }
  }
  public async remove(item: {
    id: string;
  }): Promise<MembershipType | undefined> {
    // const chr = await characters.findOne({ _id: new ObjectId(item.id) });
    //return (
    //  (await characters.findOneAndDelete({ _id: new ObjectId(item.id) })) ||
    //  undefined
    //);
    const MembershipTypeIdx = membershipTypesList.findIndex(
      (c) => c.id === item.id
    );

    if (MembershipTypeIdx !== -1) {
      const membershiptypeToRemove = membershipTypesList[MembershipTypeIdx];
      membershipTypesList.splice(MembershipTypeIdx, 1);
      return membershiptypeToRemove;
    } else {
      return undefined;
    }
  }
}
