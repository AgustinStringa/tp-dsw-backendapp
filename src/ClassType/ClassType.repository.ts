import { Repository } from "../shared/repository.js";
import { ClassType } from "./ClassType.entity.js";

const classTypes = [
  new ClassType("pileta", "tipo de fitness realizado en el agua"),
];

export class ClassTypeRepository implements Repository<ClassType> {
  public async findAll(): Promise<ClassType[] | undefined> {
    return classTypes;
  }

  public async findOne(item: { id: string }): Promise<ClassType | undefined> {
    return classTypes.find((classtype) => classtype.id === item.id);
  }

  public async add(item: ClassType): Promise<ClassType | undefined> {
    classTypes.push(item);
    return item;
  }

  public async update(item: ClassType): Promise<ClassType | undefined> {
    const classtypeIdx = classTypes.findIndex(
      (classtype) => classtype.id === item.id
    );

    if (classtypeIdx !== -1) {
      classTypes[classtypeIdx] = { ...classTypes[classtypeIdx], ...item };
    }
    return classTypes[classtypeIdx];
  }

  public async delete(item: { id: string }): Promise<ClassType | undefined> {
    const classtypeIdx = classTypes.findIndex(
      (classtype) => classtype.id === item.id
    );

    if (classtypeIdx !== -1) {
      const deletedClassType = classTypes[classtypeIdx];
      classTypes.splice(classtypeIdx, 1);
      return deletedClassType;
    }
  }
}
