import { Repository } from "../shared/repository.js";
import { Trainer } from "./Trainer.entity.js";

const trainersList = [
  new Trainer(
    "Elisito",
    "Elias",
    "elias.danteo.tomas@hotmail.com",
    "Elias",
    "Danteo"
  ),
  new Trainer(
    "entrenador",
    "***",
    "etrenador@hotmail.com",
    "Manuel",
    "Martinez"
  ),
];

export class TrainerRepository implements Repository<Trainer> {
  public async findAll(): Promise<Trainer[] | undefined> {
    return trainersList;
    //   return await characters.find({}).toArray();
  }
  public async findOne(item: { id: string }): Promise<Trainer | undefined> {
    //return (
    //  (await characters.findOne({ _id: new ObjectId(item.id) })) || undefined
    //);
    const trainers = trainersList.find((m) => m.id === item.id);
    return trainers;
  }
  public async add(item: Trainer): Promise<Trainer | undefined> {
    //asumimos que el item es una entrada ya sanitizada.
    //la tarea de sanitizacion no corresponde a esta capa
    // item._id = (await characters.insertOne(item)).insertedId;
    //return item || undefined;
    trainersList.push(item);
    return item;
  }
  public async update(item: Trainer): Promise<Trainer | undefined> {
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
    const trainersIdx = trainersList.findIndex((m) => m.id === item.id);
    if (trainersIdx !== -1) {
      trainersList[trainersIdx] = {
        ...trainersList[trainersIdx],
        ...item,
      };
      return trainersList[trainersIdx];
    } else {
      return undefined;
    }
  }
  public async remove(item: { id: string }): Promise<Trainer | undefined> {
    // const chr = await characters.findOne({ _id: new ObjectId(item.id) });
    //return (
    //  (await characters.findOneAndDelete({ _id: new ObjectId(item.id) })) ||
    //  undefined
    //);
    const trainerIdx = trainersList.findIndex((c) => c.id === item.id);

    if (trainerIdx !== -1) {
      const trainerToRemove = trainersList[trainerIdx];
      trainersList.splice(trainerIdx, 1);
      return trainerToRemove;
    } else {
      return undefined;
    }
  }
}
