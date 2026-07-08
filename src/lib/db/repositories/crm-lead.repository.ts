import CrmLead, { ICrmLead } from '../models/CrmLead';
import { AIExtractedRecord } from '@/core/types/crm';
import { Logger } from '@/lib/logger/logger';
import mongoose from 'mongoose';

export class CrmLeadRepository {
  static async insertMany(
    records: AIExtractedRecord[],
    importSessionId?: string
  ): Promise<ICrmLead[]> {
    try {
      const objId = importSessionId ? new mongoose.Types.ObjectId(importSessionId) : undefined;
      const docsToInsert = records.map(record => ({
        ...record,
        importSessionId: objId,
      }));

      const insertedDocs = await CrmLead.insertMany(docsToInsert) as unknown as ICrmLead[];
      Logger.info(`Successfully persisted ${insertedDocs.length} CRM leads to database.`);
      return insertedDocs;
    } catch (error) {
      Logger.error('Failed to insert CRM leads into database:', error);
      throw error;
    }
  }
}
