import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Reconstruimos __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class BackupService {
  // Ajustamos la ruta para que suba correctamente desde src/infrastructure/services hasta la raíz
  private static backupFolder = path.join(__dirname, "../../../../../backups");

  static async createBackup(): Promise<string> {
    if (!fs.existsSync(this.backupFolder)) {
      fs.mkdirSync(this.backupFolder, { recursive: true });
    }

    const fileName = `backup-${new Date().toISOString().replace(/:/g, "-")}.gz`;
    const filePath = path.join(this.backupFolder, fileName);

    const dbUri =
      process.env.MONGO_URI || "mongodb://localhost:27017/notebook_service_db";

    // Comando para Windows (asegurate de tener las MongoDB Database Tools instaladas)
    const command = `mongodump --uri="${dbUri}" --archive="${filePath}" --gzip`;

    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ Error en backup: ${error.message}`);
          return reject(error);
        }
        resolve(fileName);
      });
    });
  }
}
