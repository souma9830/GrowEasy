import mongoose, { Document, Model } from 'mongoose';

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  project_name: string;
  description: string;
  total_imports: number;
  total_records: number;
  imported_records: number;
  skipped_records: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new mongoose.Schema<IProject>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project_name: { type: String, required: true },
    description: { type: String, default: '' },
    total_imports: { type: Number, default: 0 },
    total_records: { type: Number, default: 0 },
    imported_records: { type: Number, default: 0 },
    skipped_records: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
