import mongoose, { Document, Model } from 'mongoose';

export interface IImportSession extends Document {
  projectId: mongoose.Types.ObjectId;
  sessionName: string;
  totalRecords: number;
  importedCount: number;
  skippedCount: number;
  successRate: number;
}

const ImportSessionSchema = new mongoose.Schema<IImportSession>(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    sessionName: { type: String, required: true },
    totalRecords: { type: Number, required: true },
    importedCount: { type: Number, required: true },
    skippedCount: { type: Number, required: true },
    successRate: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const ImportSession: Model<IImportSession> =
  mongoose.models.ImportSession || mongoose.model<IImportSession>('ImportSession', ImportSessionSchema);

export default ImportSession;
