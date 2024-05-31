import { Repository } from "../shared/repository.js";
import { Trainer } from "./Trainer.entity.js";

const TrainersList = [
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
    return TrainersList;
    //   return await characters.find({}).toArray();
  }
  public async findOne(item: { id: string }): Promise<Trainer | undefined> {
    //return (
    //  (await characters.findOne({ _id: new ObjectId(item.id) })) || undefined
    //);
    const Trainers = TrainersList.find((m) => m.id === item.id);
    return Trainers;
  }
  public async add(item: Trainer): Promise<Trainer | undefined> {
    //asumimos que el item es una entrada ya sanitizada.
    //la tarea de sanitizacion no corresponde a esta capa
    // item._id = (await characters.insertOne(item)).insertedId;
    //return item || undefined;
    TrainersList.push(item);
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
    const TrainersIdx = TrainersList.findIndex((m) => m.id === item.id);
    if (TrainersIdx !== -1) {
      TrainersList[TrainersIdx] = {
        ...TrainersList[TrainersIdx],
        ...item,
      };
      return TrainersList[TrainersIdx];
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
    const TrainersIdx = TrainersList.findIndex((c) => c.id === item.id);

    if (TrainersIdx !== -1) {
      const TrainersToRemove = TrainersList[TrainersIdx];
      TrainersList.splice(TrainersIdx, 1);
      return TrainersToRemove;
    } else {
      return undefined;
    }
  }
}
