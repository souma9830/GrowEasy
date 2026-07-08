import mongoose, { Document, Model } from 'mongoose';

export interface ICrmLead extends Document {
  created_at: string | null;
  name: string | null;
  email: string | null;
  country_code: string | null;
  mobile_without_country_code: string | null;
  company: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  lead_owner: string | null;
  crm_status: string | null;
  crm_note: string | null;
  data_source: string | null;
  possession_time: string | null;
  description: string | null;
  extra_emails?: string[];
  extra_phones?: string[];
  importSessionId?: mongoose.Types.ObjectId;
}

const CrmLeadSchema = new mongoose.Schema<ICrmLead>(
  {
    created_at: { type: String, default: null },
    name: { type: String, default: null },
    email: { type: String, default: null },
    country_code: { type: String, default: null },
    mobile_without_country_code: { type: String, default: null },
    company: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    country: { type: String, default: null },
    lead_owner: { type: String, default: null },
    crm_status: { type: String, default: null },
    crm_note: { type: String, default: null },
    data_source: { type: String, default: null },
    possession_time: { type: String, default: null },
    description: { type: String, default: null },
    extra_emails: { type: [String], default: [] },
    extra_phones: { type: [String], default: [] },
    importSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ImportSession' },
  },
  {
    timestamps: true,
  }
);

const CrmLead: Model<ICrmLead> =
  mongoose.models.CrmLead || mongoose.model<ICrmLead>('CrmLead', CrmLeadSchema);

export default CrmLead;
