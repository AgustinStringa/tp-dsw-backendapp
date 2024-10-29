import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { Request, Response } from "express";
import { orm } from "../shared/db/mikro-orm.config.js";
import { Membership } from "../Membership/Membership.entity.js";
import { Payment } from "../Membership/Payment.entity.js";

const em = orm.em;

const controller = {
  calculateStatistics: async function (req: Request, res: Response) {
    //to do: retornar cantidad de clases dictadas, cantidad de nuevos clientes
    //to do: mostrar 0 si no se encuentra ninguna membresía o pago

    try {
      const currentmonthStart = startOfMonth(new Date());
      const currentmonthEnd = endOfMonth(new Date()); //configurar bien zona horaria server
      const lastMonthStart = subMonths(currentmonthStart, 1);

      const incomesAux = await em.aggregate(Payment, [
        {
          $match: {
            dateTime: { $gte: lastMonthStart, $lte: currentmonthEnd },
          },
        },
        {
          $group: {
            _id: {
              $cond: [
                { $gte: ["$dateTime", currentmonthStart] }, //ver que algun dato no pertenezca a ambos
                "currentMonth",
                "lastMonth",
              ],
            },
            total: { $sum: "$amount" },
          },
        },
      ]);

      const membCountAux = await em.aggregate(Membership, [
        {
          $match: {
            dateFrom: { $gte: lastMonthStart, $lte: currentmonthEnd },
          },
        },
        {
          $group: {
            _id: {
              $cond: [
                { $gte: ["$dateFrom", currentmonthStart] },
                "currentMonth",
                "lastMonth",
              ],
            },
            total: { $sum: 1 },
          },
        },
      ]);

      const incomes = incomesAux.reduce((acc, { _id, total }) => {
        acc[_id] = total;
        return acc;
      }, {});

      const membershipsCount = membCountAux.reduce((acc, { _id, total }) => {
        acc[_id] = total;
        return acc;
      }, {});

      return res
        .status(200)
        .json({
          message: "Statistics generated.",
          data: { incomes, membershipsCount },
        });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};

export { controller };
