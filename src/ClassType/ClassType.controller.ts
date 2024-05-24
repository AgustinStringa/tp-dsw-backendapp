import { Request, Response } from "express";
import { ClassTypeRepository } from "./ClassType.repository.js";
import { ClassType } from "./ClassType.entity.js";

const repository= new ClassTypeRepository

async function findAll(req: Request, res: Response) {
  res.json({data: await repository.findAll()})
}

async function findOne(req: Request, res: Response){
  const id = req.params.id
  const classtype = await repository.findOne({id})
  if (!classtype) {
    return res.status(404).send({message: 'Class Type not Found'})
  }
  res.json({data: classtype})
}

async function add(req: Request, res: Response){
  const input = req.body.sanitizedInput
  const newClassType = await repository.add( new ClassType(input.name, input.description))
  return res.status(201).send( {message: 'Class Type created', data: newClassType} )
}

async function update(req: Request, res: Response){
  req.body.sanitizedInput.id=req.params.id
  const classtype=await repository.update(req.body.sanitizedInput)

  if (!classtype){
    return res.status(404).send({message: 'Class Type not Found'})
  }
  return res.status(200).send( {message: 'Class Type updated successfully', data: classtype} )
}

async function remove(req: Request, res: Response){
  const id= req.params.id
  const classtype= await repository.remove({id})

  if (!classtype){
    return res.status(404).send({message: 'Class Type not Found'})
  } else {
    res.status(200).send({message: 'Class Type deleted successfully'})
  }

}

export {findAll, findOne, add, update, remove}