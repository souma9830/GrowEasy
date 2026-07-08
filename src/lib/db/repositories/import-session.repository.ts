import ImportSession, { IImportSession } from '../models/ImportSession';
import { ImportStats } from '@/core/types/crm';
import { Logger } from '@/lib/logger/logger';

export class ImportSessionRepository {

  static async create(
    sessionName: string,
    stats: ImportStats
  ): Promise<IImportSession> {
    try {
      const session = await ImportSession.create({
        sessionName,
        totalRecords: stats.totalRecords,
        importedCount: stats.importedCount,
        skippedCount: stats.skippedCount,
        successRate: stats.successRate,
      });

      Logger.info(`Successfully created ImportSession: ${sessionName} (${session._id})`);
      return session;
    } catch (error) {
      Logger.error('Failed to create ImportSession in database:', error);
      throw error;
    }
  }
}
