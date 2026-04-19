import type { Request, Response } from "express";
import { BackupService } from "../../infrastructure/services/BackupService.js";

export class AdminController {
  static async triggerBackup(req: Request, res: Response) {
    try {
      const fileName = await BackupService.createBackup();
      res.json({ message: "Backup exitoso", file: fileName });
    } catch (error) {
      res.status(500).json({ message: "Error al generar backup" });
    }
  }
}
