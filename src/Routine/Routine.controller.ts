import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/mikro-orm.config.js';
import { Routine } from './Routine.entity.js';
import { Trainer } from '../Trainer/Trainer.entity.js';
import { Client } from '../Client/Client.entity.js';
import { lightFormat, addDays, startOfWeek } from 'date-fns';
const em = orm.em;

const controller = {
  findAll: async function (_: Request, res: Response) {
    try {
      const routines = await em.find(
        Routine,
        {},
        {
          populate: ['client', 'trainer', 'exercisesRoutine'],
        }
      );
      res.status(200).json({
        message: 'All routines were found',
        data: routines,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const routine = await em.findOneOrFail(
        Routine,
        { id },
        {
          populate: [
            'client',
            'trainer',
            'exercisesRoutine',
            'exercisesRoutine.exercise',
          ],
        }
      );
      res.status(200).json({ message: 'Routine found', data: routine });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      if (req.body.start > req.body.end) {
        return res.status(400).json({
          message: 'End date must be greather than start date',
        });
      }
      const firstMonday = addDays(startOfWeek(new Date()), 1);
      if (new Date(req.body.start) < firstMonday) {
        return res.status(400).json({
          message: "Routine's start date must be greater than last monday",
        });
      }
      const trainer = await em.findOneOrFail(Trainer, { id: req.body.trainer });
      if (!trainer) {
        return res.status(400).json({
          message: 'Trainer not found',
        });
      }
      const client = await em.findOneOrFail(
        Client,
        { id: req.body.client },
        { populate: ['routines'] }
      );
      if (!client) {
        return res.status(400).json({
          message: 'Client not found',
        });
      }
      const lastRoutine = client.getLastRoutine();
      if (lastRoutine == null || !(new Date(req.body.end) > lastRoutine.end)) {
        const routine = em.create(Routine, req.body.sanitizedInput);
        await em.flush();
        res.status(201).json({ message: 'Routine created', data: routine });
      } else {
        return res.status(400).json({
          message: 'There is overlap between routines',
          data: lastRoutine,
        });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      if (req.body.trainer !== undefined) {
        await em.findOneOrFail(Trainer, { id: req.body.trainer });
      }
      if (req.body.client) {
        await em.findOneOrFail(Client, { id: req.body.client });
      }
      const id = req.params.id;
      const routine = await em.findOneOrFail(Routine, { id });
      em.assign(routine, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: 'Routine updated', data: routine });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const routine = em.getReference(Routine, id);
      await em.removeAndFlush(routine);
      res.status(200).json({ message: 'Routine deleted' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  findCurrentRoutine: async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const today: Date = new Date();

      console.log('Today:', today);
      console.log('Query Parameters:', {
        client: userId,
        //start: { $lte: today },
        //end: { $gte: today },
      });
      console.log('Today:', today.toISOString());

      const routine = await em.findOneOrFail(
        Routine,
        {
          client: userId,
          //TO DO: no puedo validar que este dentro de esta semana
          //start: { $lte: today.toISOString() },
          //end: { $gte: today.toISOString() },
        },
        {
          populate: [
            'client',
            'trainer',
            'exercisesRoutine',
            'exercisesRoutine.exercise',
          ],
        }
      );

      if (!routine) {
        return res.status(404).json({ message: 'Routine not found' });
      }

      res.status(200).json({ message: 'Routine found', data: routine });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  sanitizeRoutine: function (req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
      start: req.body.start,
      end: req.body.end,
      trainer: req.body.trainer,
      client: req.body.client,
      exercisesRoutine: req.body.exercisesRoutine,
    };
    //more checks about malicious content, sql injections, data type...

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key];
      }
    });
    next();
  },
};

export { controller };
