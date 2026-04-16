import type { Request, Response } from "express";
import { DeviceModel } from "../../infrastructure/models/DeviceModel.ts";

export class StatsController {
  static async getCommonFaults(req: Request, res: Response) {
    try {
      const stats = await DeviceModel.aggregate([
        // Filtramos solo las que ya tienen un diagnóstico categorizado
        { $match: { commonFaultCategory: { $exists: true, $ne: null } } },

        // Agrupamos por modelo y categoría de falla
        {
          $group: {
            _id: { model: "$model", category: "$commonFaultCategory" },
            count: { $sum: 1 },
          },
        },

        // Ordenamos para ver las más frecuentes arriba
        { $sort: { count: -1 } },

        // Formateamos la salida
        {
          $project: {
            _id: 0,
            model: "$_id.model",
            fault: "$_id.category",
            occurrences: "$count",
          },
        },
      ]);

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error generating statistics" });
    }
  }
}
