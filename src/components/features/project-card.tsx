import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Folder, Clock, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

interface ProjectCardProps {
  project: {
    _id: string;
    project_name: string;
    description?: string;
    total_imports: number;
    total_records: number;
    imported_records: number;
    skipped_records: number;
    updatedAt: string;
  };
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link href={`/projects/${project._id}`} className="block group">
      <Card 
        padding="lg" 
        className="h-full hover:border-[var(--text-tertiary)] hover:shadow-sm transition-all duration-200"
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-default)] group-hover:bg-[var(--gray-100)] transition-colors">
            <Folder size={20} className="text-[var(--text-secondary)]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] leading-tight mb-1">
              {project.project_name}
            </h3>
            <p className="text-xs text-[var(--text-tertiary)] flex items-center gap-1.5">
              <Clock size={12} />
              Updated {new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        {project.description && (
          <p className="text-xs text-[var(--text-secondary)] mb-5 line-clamp-2">
            {project.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--border-default)] mt-auto">
          <div className="flex items-center gap-1.5">
            <FileText size={14} className="text-[var(--text-tertiary)]" />
            <div>
              <p className="text-[10px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Total Records</p>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{project.total_records.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle size={14} className="text-emerald-500" />
            <div>
              <p className="text-[10px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Imported</p>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{project.imported_records.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
